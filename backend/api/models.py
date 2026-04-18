from django.db import models
import uuid
from django.utils import timezone


def gen_id():
    return str(uuid.uuid4())


class User(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    usage_type = models.CharField(max_length=100, blank=True)
    preferred_brands = models.CharField(max_length=255, blank=True)
    recommendations = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = "user_profiles"

    def add_recommendation(self, type: str, criterion: str):
        self.recommendations.append({
            "type": type,
            "criterion": criterion,
            "date": str(timezone.now().date())
        })
        self.save()

    def __str__(self):
        return f"Profile of {self.user.email}"


class Category(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class Meta:
        db_table = "categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")

    class Meta:
        db_table = "products"

    def __str__(self):
        return self.name


class Stock(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="stock")
    available_quantity = models.IntegerField(default=0)
    reserved_quantity = models.IntegerField(default=0)
    reorder_point = models.IntegerField(default=5)

    class Meta:
        db_table = "stock"

    def __str__(self):
        return f"Stock for {self.product.name}: {self.available_quantity}"


class Cart(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")

    class Meta:
        db_table = "carts"

    def __str__(self):
        return f"Cart of {self.user.email}"


class CartItem(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    class Meta:
        db_table = "cart_items"


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping_address = models.CharField(max_length=300, blank=True)

    class Meta:
        db_table = "orders"

    def __str__(self):
        return f"Order {self.id} - {self.user.email}"


class OrderDetail(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="details")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = "order_details"

    def __str__(self):
        return f"{self.quantity}x {self.product.name} in order {self.order.id}"