
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
    # Health check
    path("health/", health),

    # Usuarios
    path("usuarios/registro/", RegistrarUsuarioView.as_view()),
    path("usuarios/<str:usuario_id>/perfil/", ActualizarPerfilView.as_view()),

    # Productos
    path("productos/categoria/<str:categoria_id>/", ListarProductosCategoriaView.as_view()),
    path("productos/<str:producto_id>/", DetalleProductoView.as_view()),

    # Carrito
    path("carrito/<str:usuario_id>/", VerCarritoView.as_view()),
    path("carrito/<str:usuario_id>/agregar/", AgregarProductoCarritoView.as_view()),
    path("carrito/<str:usuario_id>/eliminar/<str:producto_id>/", EliminarProductoCarritoView.as_view()),

    # Pedidos
    path("pedidos/crear/", CrearPedidoView.as_view()),
    path("pedidos/<str:usuario_id>/", ListarPedidosView.as_view()),

    # Recomendaciones
    path("recomendaciones/<str:usuario_id>/", RecomendacionesView.as_view()),
]
