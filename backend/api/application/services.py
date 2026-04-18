
from api.domain.Builder import OrderBuilder
from api.infra.Factory import NotifierFactory
from api.models import (
    User, UserProfile, Product, Stock,
    Cart, CartItem, Order, Category
)

# UserService
class UserService:

    def register(self, data: dict):
        if User.objects.filter(email=data["email"]).exists():
            raise ValueError("A user with that email already exists.")
        user = User.objects.create(
            name=data["name"],
            email=data["email"],
            password=data["password"],   # In production: use hashing
        )
        UserProfile.objects.create(
            user=user,
            budget=data.get("budget"),
            usage_type=data.get("usage_type", ""),
            preferred_brands=data.get("preferred_brands", ""),
        )
        Cart.objects.create(user=user)
        return user

    def update_profile(self, user_id: str, data: dict):
        try:
            profile = UserProfile.objects.get(user_id=user_id)
        except UserProfile.DoesNotExist:
            raise ValueError("Profile not found.")
        profile.budget = data.get("budget", profile.budget)
        profile.usage_type = data.get("usage_type", profile.usage_type)
        profile.preferred_brands = data.get("preferred_brands", profile.preferred_brands)
        profile.save()
        return profile


# ProductService
class ProductService:

    def list_by_category(self, category_id: str) -> list:
        return list(Product.objects.filter(category_id=category_id).select_related("stock"))

    def get_detail(self, product_id: str):
        try:
            return Product.objects.select_related("stock", "category").get(id=product_id)
        except Product.DoesNotExist:
            raise ValueError("Product not found.")


# StockService
class StockService:

    def __init__(self):
        self.notifier = NotifierFactory.create()

    def check_availability(self, product_id: str, quantity: int) -> bool:
        try:
            stock = Stock.objects.get(product_id=product_id)
        except Stock.DoesNotExist:
            raise ValueError("No stock record found for that product.")
        return stock.available_quantity >= quantity

    def reserve(self, product_id: str, quantity: int):
        stock = Stock.objects.select_for_update().get(product_id=product_id)
        if stock.available_quantity < quantity:
            raise ValueError(f"Insufficient stock for product {product_id}.")
        stock.available_quantity -= quantity
        stock.reserved_quantity += quantity
        stock.save()

    def release(self, product_id: str, quantity: int):
        stock = Stock.objects.get(product_id=product_id)
        stock.reserved_quantity -= quantity
        stock.available_quantity += quantity
        stock.save()

    def confirm_deduction(self, product_id: str, quantity: int):
        stock = Stock.objects.get(product_id=product_id)
        stock.reserved_quantity -= quantity
        stock.save()
        if stock.available_quantity <= stock.reorder_point:
            product = stock.product
            self.notifier.send_low_stock_notification(product)


# CartService
class CartService:

    def __init__(self):
        self.stock_service = StockService()

    def add_product(self, user_id: str, product_id: str, quantity: int):
        if not self.stock_service.check_availability(product_id, quantity):
            raise ValueError("Not enough stock to add to cart.")
        cart = Cart.objects.get(user_id=user_id)
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_id=product_id,
            defaults={"quantity": quantity}
        )
        if not created:
            item.quantity += quantity
            item.save()

    def remove_product(self, user_id: str, product_id: str):
        cart = Cart.objects.get(user_id=user_id)
        CartItem.objects.filter(cart=cart, product_id=product_id).delete()

    def calculate_total(self, user_id: str) -> dict:
        cart = Cart.objects.prefetch_related("items__product").get(user_id=user_id)
        items = cart.items.all()
        total = sum(i.product.price * i.quantity for i in items)
        return {
            "items": [
                {
                    "product": i.product.name,
                    "quantity": i.quantity,
                    "unit_price": float(i.product.price),
                    "subtotal": float(i.product.price * i.quantity),
                }
                for i in items
            ],
            "total": float(total),
        }


# OrderService
class OrderService:

    def __init__(self):
        self.notifier = NotifierFactory.create()
        self.stock_service = StockService()

    def create_order(self, data: dict):
        """
        Main flow:
        1. Get cart items
        2. Validate and reserve stock for each product
        3. Build the order with OrderBuilder
        4. Send confirmation notification
        """
        user_id = data["user_id"]
        address = data["shipping_address"]

        # 1. Get cart
        try:
            cart = Cart.objects.prefetch_related("items__product").get(user_id=user_id)
        except Cart.DoesNotExist:
            raise ValueError("The user does not have an active cart.")

        items = list(cart.items.all())
        if not items:
            raise ValueError("The cart is empty.")

        # 2. Validate stock before reserving
        for item in items:
            if not self.stock_service.check_availability(item.product_id, item.quantity):
                raise ValueError(f"Insufficient stock for: {item.product.name}")

        # 3. Reserve stock
        for item in items:
            self.stock_service.reserve(item.product_id, item.quantity)

        # 4. Build order with Builder
        builder_products = [{"product": i.product, "quantity": i.quantity} for i in items]
        try:
            order = (
                OrderBuilder()
                .for_user(user_id)
                .with_products(builder_products)
                .with_address(address)
                .calculate_total()
                .build()
            )
        except Exception as exc:
            # Revert reservations if builder fails
            for item in items:
                self.stock_service.release(item.product_id, item.quantity)
            raise exc

        # 5. Confirm stock deduction and clear cart
        for item in items:
            self.stock_service.confirm_deduction(item.product_id, item.quantity)
        cart.items.all().delete()

        # 6. Notify
        self.notifier.send_confirmation(order)

        return order

    def list_user_orders(self, user_id: str) -> list:
        return list(Order.objects.filter(user_id=user_id).prefetch_related("details__product"))


# RecommendationService

class RecommendationService:
    """
    Generates and stores recommendations in the UserProfile JSONField.
    No separate table — the profile is the source of truth.
    """

    def generate_recommendation(self, user_id: str) -> list:
        try:
            profile = UserProfile.objects.get(user_id=user_id)
        except UserProfile.DoesNotExist:
            raise ValueError("User profile not found.")

        criterion = profile.usage_type or "general"
        brands = profile.preferred_brands or ""
        budget = float(profile.budget) if profile.budget else None

        products_qs = Product.objects.all()
        if brands:
            brand_list = [b.strip() for b in brands.split(",")]
            products_qs = products_qs.filter(brand__in=brand_list)
        if budget:
            products_qs = products_qs.filter(price__lte=budget)

        recommended = list(products_qs[:5].values("id", "name", "brand", "price"))

        profile.add_recommendation(type=criterion, criterion=f"budget={budget}, brands={brands}")
        return recommended