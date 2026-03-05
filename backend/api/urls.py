
"""
urls.py — Rutas principales del proyecto PuntoTech
"""
from django.contrib import admin
from django.urls import path
from api.presentation.views import (
    health,
    RegistrarUsuarioView, ActualizarPerfilView,
    ListarProductosCategoriaView, DetalleProductoView,
    AgregarProductoCarritoView, VerCarritoView, EliminarProductoCarritoView,

    CrearPedidoView, ListarPedidosView,
    RecomendacionesView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Health check
    path("api/health/", health),

    # Usuarios
    path("api/usuarios/registro/", RegistrarUsuarioView.as_view()),
    path("api/usuarios/<str:usuario_id>/perfil/", ActualizarPerfilView.as_view()),

    # Productos
    path("api/productos/categoria/<str:categoria_id>/", ListarProductosCategoriaView.as_view()),
    path("api/productos/<str:producto_id>/", DetalleProductoView.as_view()),

    # Carrito
    path("api/carrito/<str:usuario_id>/", VerCarritoView.as_view()),
    path("api/carrito/<str:usuario_id>/agregar/", AgregarProductoCarritoView.as_view()),
    path("api/carrito/<str:usuario_id>/eliminar/<str:producto_id>/", EliminarProductoCarritoView.as_view()),

    # Pedidos
    path("api/pedidos/crear/", CrearPedidoView.as_view()),
    path("api/pedidos/<str:usuario_id>/", ListarPedidosView.as_view()),

    # Recomendaciones
    path("api/recomendaciones/<str:usuario_id>/", RecomendacionesView.as_view()),
]