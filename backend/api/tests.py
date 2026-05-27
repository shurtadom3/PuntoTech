from unittest.mock import Mock, patch

from django.test import TestCase
from rest_framework.test import APIClient

from api.models import Cart, CartItem, Category, Product, Stock, User, UserProfile


class CreateOrderViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            name="Sara",
            email="sara@example.com",
            password="secret123",
        )
        UserProfile.objects.create(user=self.user)
        self.cart = Cart.objects.create(user=self.user)
        category = Category.objects.create(name="Portatiles", description="")
        self.product = Product.objects.create(
            name="Laptop PuntoTech",
            brand="PuntoTech",
            price="2500000.00",
            description="",
            category=category,
        )
        Stock.objects.create(product=self.product, available_quantity=3, reserved_quantity=0)
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=1)

    @patch("api.application.services.NotifierFactory.create")
    def test_create_order_confirms_purchase_and_returns_delivery_estimate(self, create_notifier):
        notifier = Mock()
        notifier.send_confirmation.return_value = True
        create_notifier.return_value = notifier

        response = self.client.post(
            "/api/pedidos/crear/",
            {
                "user_id": self.user.id,
                "shipping_address": "Calle 123, Bogota",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "confirmed")
        self.assertTrue(response.data["email_sent"])
        self.assertIn("estimated_delivery_date", response.data)
        self.assertIn("producto se compro correctamente", response.data["message"])
        notifier.send_confirmation.assert_called_once()
