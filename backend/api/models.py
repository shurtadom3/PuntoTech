from django.db import models
import uuid
from django.utils import timezone


def gen_id():
    return str(uuid.uuid4())


class Usuario(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    nombre = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    class Meta:
        db_table = "usuarios"

    def __str__(self):
        return self.email


class PerfilUsuario(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name="perfil")
    presupuesto = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    tipo_uso = models.CharField(max_length=100, blank=True)
    marcas_preferidas = models.CharField(max_length=255, blank=True)
    recomendaciones = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = "perfil_usuario"

    def agregar_recomendacion(self, tipo: str, criterio: str):
        self.recomendaciones.append({
            "tipo": tipo,
            "criterio": criterio,
            "fecha": str(timezone.now().date())
        })
        self.save()

    def __str__(self):
        return f"Perfil de {self.usuario.email}"


class Categoria(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)

    class Meta:
        db_table = "categorias"

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    nombre = models.CharField(max_length=200)
    marca = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    descripcion = models.TextField(blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, related_name="productos")

    class Meta:
        db_table = "productos"

    def __str__(self):
        return self.nombre


class Stock(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    producto = models.OneToOneField(Producto, on_delete=models.CASCADE, related_name="stock")
    cantidad_disponible = models.IntegerField(default=0)
    cantidad_reservada = models.IntegerField(default=0)
    punto_reposicion = models.IntegerField(default=5)

    class Meta:
        db_table = "stock"

    def __str__(self):
        return f"Stock de {self.producto.nombre}: {self.cantidad_disponible}"


class Carrito(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name="carrito")

    class Meta:
        db_table = "carritos"

    def __str__(self):
        return f"Carrito de {self.usuario.email}"


class ItemCarrito(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)

    class Meta:
        db_table = "items_carrito"


class Pedido(models.Model):
    ESTADO_CHOICES = [
        ("pendiente", "Pendiente"),
        ("confirmado", "Confirmado"),
        ("enviado", "Enviado"),
        ("entregado", "Entregado"),
        ("cancelado", "Cancelado"),
    ]

    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="pedidos")
    fecha = models.DateField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default="pendiente")
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    direccion_envio = models.CharField(max_length=300, blank=True)

    class Meta:
        db_table = "pedidos"

    def __str__(self):
        return f"Pedido {self.id} - {self.usuario.email}"


class DetallePedido(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=gen_id, editable=False)
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="detalles")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = "detalle_pedido"

    def __str__(self):
        return f"{self.cantidad}x {self.producto.nombre} en pedido {self.pedido.id}"