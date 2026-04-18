from django.urls import path
from api.presentation.views import (
    health, RegisterUserView, UpdateProfileView,
    ListProductsByCategoryView, ProductDetailView,
    AddCartItemView, ViewCartView, RemoveCartItemView,
    CreateOrderView, ListOrdersView,
    RecommendationsView,
)

urlpatterns = [
    # Health check
    path("health/", health),

    # Usuarios
    path("usuarios/registro/", RegisterUserView.as_view()),
    path("usuarios/<str:usuario_id>/perfil/", UpdateProfileView.as_view()),

    # Productos
    path("productos/categoria/<str:categoria_id>/", ListProductsByCategoryView.as_view()),
    path("productos/<str:producto_id>/", ProductDetailView.as_view()),

    # Carrito
    path("carrito/<str:usuario_id>/", ViewCartView.as_view()),
    path("carrito/<str:usuario_id>/agregar/", AddCartItemView.as_view()),
    path("carrito/<str:usuario_id>/eliminar/<str:producto_id>/", RemoveCartItemView.as_view()),

    # Pedidos
    path("pedidos/crear/", CreateOrderView.as_view()),
    path("pedidos/<str:usuario_id>/", ListOrdersView.as_view()),

    # Recomendaciones
    path("recomendaciones/<str:usuario_id>/", RecommendationsView.as_view()),
]
