from django.contrib import admin

# Register your models here.
from .models import Usuario, PerfilUsuario, Categoria, Producto, Pedido, Carrito, ItemCarrito, Stock, DetallePedido
admin.site.register(Usuario)
admin.site.register(PerfilUsuario)
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(Pedido)
admin.site.register(Carrito)
admin.site.register(ItemCarrito)
admin.site.register(Stock)
admin.site.register(DetallePedido)