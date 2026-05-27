from django.db import models
import uuid
from django.utils import timezone


def gen_id():
    return str(uuid.uuid4())


class User(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    name = models.CharField(max_length=150, db_column="nombre")
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    class Meta:
        db_table = "usuarios"

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile", db_column="usuario_id")
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, db_column="presupuesto")
    usage_type = models.CharField(max_length=100, blank=True, db_column="tipo_uso")
    preferred_brands = models.CharField(max_length=255, blank=True, db_column="marcas_preferidas")
    recommendations = models.JSONField(default=list, blank=True, db_column="recomendaciones")

    class Meta:
        db_table = "perfil_usuario"

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
    name = models.CharField(max_length=100, db_column="nombre")
    description = models.TextField(blank=True, db_column="descripcion")

    class Meta:
        db_table = "categorias"

    def __str__(self):
        return self.name


class Product(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    name = models.CharField(max_length=200, db_column="nombre")
    brand = models.CharField(max_length=100, db_column="marca")
    price = models.DecimalField(max_digits=12, decimal_places=2, db_column="precio")
    description = models.TextField(blank=True, db_column="descripcion")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products", db_column="categoria_id")

    class Meta:
        db_table = "productos"

    def __str__(self):
        return self.name


class Stock(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="stock", db_column="producto_id")
    available_quantity = models.IntegerField(default=0, db_column="cantidad_disponible")
    reserved_quantity = models.IntegerField(default=0, db_column="cantidad_reservada")
    reorder_point = models.IntegerField(default=5, db_column="punto_reposicion")

    class Meta:
        db_table = "stock"

    def __str__(self):
        return f"Stock for {self.product.name}: {self.available_quantity}"


class Cart(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart", db_column="usuario_id")

    class Meta:
        db_table = "carritos"

    def __str__(self):
        return f"Cart of {self.user.email}"


class CartItem(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items", db_column="carrito_id")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, db_column="producto_id")
    quantity = models.IntegerField(default=1, db_column="cantidad")

    class Meta:
        db_table = "items_carrito"


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders", db_column="usuario_id")
    date = models.DateField(auto_now_add=True, db_column="fecha")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", db_column="estado")
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping_address = models.CharField(max_length=300, blank=True, db_column="direccion_envio")

    class Meta:
        db_table = "pedidos"

    def __str__(self):
        return f"Order {self.id} - {self.user.email}"


class OrderDetail(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="details", db_column="pedido_id")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, db_column="producto_id")
    quantity = models.IntegerField(db_column="cantidad")
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, db_column="precio_unitario")

    class Meta:
        db_table = "detalle_pedido"

    def __str__(self):
        return f"{self.quantity}x {self.product.name} in order {self.order.id}"
