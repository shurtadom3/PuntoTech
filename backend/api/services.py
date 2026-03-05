"""
services.py
-----------
Service Layer — aquí vive TODA la lógica de negocio.
Las Views NUNCA validan, calculan ni modifican estado directamente.
Cumple: SRP, Dependency Injection, SOLID.
"""
from sistema.domain.Builder import PedidoBuilder
from sistema.infra.Factory import NotificadorFactory
from sistema.models import (
    Usuario, PerfilUsuario, Producto, Stock,
    Carrito, ItemCarrito, Pedido, Categoria
)


# ─────────────────────────────────────────────
# UsuarioService
# ─────────────────────────────────────────────
class UsuarioService:

    def registrar(self, datos: dict) -> Usuario:
        if Usuario.objects.filter(email=datos["email"]).exists():
            raise ValueError("Ya existe un usuario con ese email.")
        usuario = Usuario.objects.create(
            nombre=datos["nombre"],
            email=datos["email"],
            password=datos["password"],   # En producción: usar hashing
        )
        PerfilUsuario.objects.create(
            usuario=usuario,
            presupuesto=datos.get("presupuesto"),
            tipo_uso=datos.get("tipo_uso", ""),
            marcas_preferidas=datos.get("marcas_preferidas", ""),
        )
        Carrito.objects.create(usuario=usuario)
        return usuario

    def actualizar_perfil(self, usuario_id: str, datos: dict) -> PerfilUsuario:
        try:
            perfil = PerfilUsuario.objects.get(usuario_id=usuario_id)
        except PerfilUsuario.DoesNotExist:
            raise ValueError("Perfil no encontrado.")
        perfil.presupuesto = datos.get("presupuesto", perfil.presupuesto)
        perfil.tipo_uso = datos.get("tipo_uso", perfil.tipo_uso)
        perfil.marcas_preferidas = datos.get("marcas_preferidas", perfil.marcas_preferidas)
        perfil.save()
        return perfil


# ─────────────────────────────────────────────
# ProductoService
# ─────────────────────────────────────────────
class ProductoService:

    def listar_por_categoria(self, categoria_id: str) -> list:
        return list(Producto.objects.filter(categoria_id=categoria_id).select_related("stock"))

    def obtener_detalle(self, producto_id: str) -> Producto:
        try:
            return Producto.objects.select_related("stock", "categoria").get(id=producto_id)
        except Producto.DoesNotExist:
            raise ValueError("Producto no encontrado.")


# ─────────────────────────────────────────────
# StockService
# ─────────────────────────────────────────────
class StockService:

    def __init__(self):
        self.notificador = NotificadorFactory.crear()

    def validar_disponibilidad(self, producto_id: str, cantidad: int) -> bool:
        try:
            stock = Stock.objects.get(producto_id=producto_id)
        except Stock.DoesNotExist:
            raise ValueError("No existe registro de stock para ese producto.")
        return stock.cantidad_disponible >= cantidad

    def reservar(self, producto_id: str, cantidad: int):
        stock = Stock.objects.select_for_update().get(producto_id=producto_id)
        if stock.cantidad_disponible < cantidad:
            raise ValueError(f"Stock insuficiente para el producto {producto_id}.")
        stock.cantidad_disponible -= cantidad
        stock.cantidad_reservada += cantidad
        stock.save()

    def liberar(self, producto_id: str, cantidad: int):
        stock = Stock.objects.get(producto_id=producto_id)
        stock.cantidad_reservada -= cantidad
        stock.cantidad_disponible += cantidad
        stock.save()

    def confirmar_descuento(self, producto_id: str, cantidad: int):
        stock = Stock.objects.get(producto_id=producto_id)
        stock.cantidad_reservada -= cantidad
        stock.save()
        if stock.cantidad_disponible <= stock.punto_reposicion:
            producto = stock.producto
            self.notificador.enviar_notificacion_stock(producto)


# ─────────────────────────────────────────────
# CarritoService
# ─────────────────────────────────────────────
class CarritoService:

    def __init__(self):
        self.stock_service = StockService()

    def agregar_producto(self, usuario_id: str, producto_id: str, cantidad: int):
        if not self.stock_service.validar_disponibilidad(producto_id, cantidad):
            raise ValueError("No hay stock suficiente para agregar al carrito.")
        carrito = Carrito.objects.get(usuario_id=usuario_id)
        item, created = ItemCarrito.objects.get_or_create(
            carrito=carrito,
            producto_id=producto_id,
            defaults={"cantidad": cantidad}
        )
        if not created:
            item.cantidad += cantidad
            item.save()

    def eliminar_producto(self, usuario_id: str, producto_id: str):
        carrito = Carrito.objects.get(usuario_id=usuario_id)
        ItemCarrito.objects.filter(carrito=carrito, producto_id=producto_id).delete()

    def calcular_total(self, usuario_id: str) -> dict:
        carrito = Carrito.objects.prefetch_related("items__producto").get(usuario_id=usuario_id)
        items = carrito.items.all()
        total = sum(i.producto.precio * i.cantidad for i in items)
        return {
            "items": [
                {
                    "producto": i.producto.nombre,
                    "cantidad": i.cantidad,
                    "precio_unitario": float(i.producto.precio),
                    "subtotal": float(i.producto.precio * i.cantidad),
                }
                for i in items
            ],
            "total": float(total),
        }


# ─────────────────────────────────────────────
# PedidoService
# ─────────────────────────────────────────────
class PedidoService:

    def __init__(self):
        self.notificador = NotificadorFactory.crear()
        self.stock_service = StockService()

    def crear_pedido(self, datos: dict) -> Pedido:
        """
        Flujo principal:
        1. Obtener items del carrito
        2. Validar y reservar stock por cada producto
        3. Construir el pedido con PedidoBuilder
        4. Notificar confirmación
        """
        usuario_id = datos["usuario_id"]
        direccion = datos["direccion_envio"]

        # 1. Obtener carrito
        try:
            carrito = Carrito.objects.prefetch_related("items__producto").get(usuario_id=usuario_id)
        except Carrito.DoesNotExist:
            raise ValueError("El usuario no tiene carrito activo.")

        items = list(carrito.items.all())
        if not items:
            raise ValueError("El carrito está vacío.")

        # 2. Validar stock antes de reservar
        for item in items:
            if not self.stock_service.validar_disponibilidad(item.producto_id, item.cantidad):
                raise ValueError(f"Stock insuficiente para: {item.producto.nombre}")

        # 3. Reservar stock
        for item in items:
            self.stock_service.reservar(item.producto_id, item.cantidad)

        # 4. Construir pedido con el Builder
        productos_builder = [{"producto": i.producto, "cantidad": i.cantidad} for i in items]
        try:
            pedido = (
                PedidoBuilder()
                .para_usuario(usuario_id)
                .con_productos(productos_builder)
                .con_direccion(direccion)
                .calcular_total()
                .build()
            )
        except Exception as exc:
            # Revertir reservas si el builder falla
            for item in items:
                self.stock_service.liberar(item.producto_id, item.cantidad)
            raise exc

        # 5. Confirmar descuento de stock y limpiar carrito
        for item in items:
            self.stock_service.confirmar_descuento(item.producto_id, item.cantidad)
        carrito.items.all().delete()

        # 6. Notificar
        self.notificador.enviar_confirmacion(pedido)

        return pedido

    def listar_pedidos_usuario(self, usuario_id: str) -> list:
        return list(Pedido.objects.filter(usuario_id=usuario_id).prefetch_related("detalles__producto"))


# ─────────────────────────────────────────────
# RecomendacionService
# ─────────────────────────────────────────────
class RecomendacionService:
    """
    Genera y almacena recomendaciones en el JSONField del PerfilUsuario.
    No existe como tabla separada — el perfil es la fuente de verdad.
    """

    def generar_recomendacion(self, usuario_id: str) -> list:
        try:
            perfil = PerfilUsuario.objects.get(usuario_id=usuario_id)
        except PerfilUsuario.DoesNotExist:
            raise ValueError("Perfil de usuario no encontrado.")

        criterio = perfil.tipo_uso or "general"
        marcas = perfil.marcas_preferidas or ""
        presupuesto = float(perfil.presupuesto) if perfil.presupuesto else None

        productos_qs = Producto.objects.all()
        if marcas:
            lista_marcas = [m.strip() for m in marcas.split(",")]
            productos_qs = productos_qs.filter(marca__in=lista_marcas)
        if presupuesto:
            productos_qs = productos_qs.filter(precio__lte=presupuesto)

        recomendados = list(productos_qs[:5].values("id", "nombre", "marca", "precio"))

        perfil.agregar_recomendacion(tipo=criterio, criterio=f"presupuesto={presupuesto}, marcas={marcas}")
        return recomendados