
"""
urls.py — Rutas principales del proyecto PuntoTech
"""
from django.contrib import admin
from django.urls import path
from api.presentation.views import (
    health,
    RegistrarUsuarioView, ActualizarPerfilView, LoginView,

)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Health check
    path("api/health/", health),

    # Usuarios
    path("usuarios/register/", RegistrarUsuarioView.as_view()),
    path("usuarios/<str:usuario_id>/perfil/", ActualizarPerfilView.as_view()),
    path("usuarios/login/", LoginView.as_view()),
]