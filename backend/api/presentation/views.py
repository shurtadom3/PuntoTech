"""
views.py
--------
Capa de presentación — SOLO orquesta: recibe → llama servicio → responde.
Ninguna vista supera las 15 líneas de lógica.
"""
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.application.services import (
    UsuarioService, ProductoService,
    CarritoService, PedidoService, RecomendacionService
)
from api.presentation.serializers import (
    UsuarioRegistroSerializer, ActualizarPerfilSerializer,
    AgregarProductoCarritoSerializer, CrearPedidoSerializer,
    ProductoSerializer, PedidoSerializer
)

def health(request):
    return JsonResponse({"status": "ok", "message": "Django conectado"})


# ── Usuarios ──────────────────────────────────────────────────────────────────

class RegistrarUsuarioView(APIView):
    def post(self, request):
        serializer = UsuarioRegistroSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            usuario = UsuarioService().registrar(serializer.validated_data)
            return Response({"id": usuario.id, "email": usuario.email}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)


class ActualizarPerfilView(APIView):
    def put(self, request, usuario_id):
        serializer = ActualizarPerfilSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            perfil = UsuarioService().actualizar_perfil(usuario_id, serializer.validated_data)
            return Response({"mensaje": "Perfil actualizado", "tipo_uso": perfil.tipo_uso}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


# ── Productos ─────────────────────────────────────────────────────────────────

class ListarProductosCategoriaView(APIView):
    def get(self, request, categoria_id):
        productos = ProductoService().listar_por_categoria(categoria_id)
        data = ProductoSerializer(productos, many=True).data
        return Response(data, status=status.HTTP_200_OK)


class DetalleProductoView(APIView):
    def get(self, request, producto_id):
        try:
            producto = ProductoService().obtener_detalle(producto_id)
            return Response(ProductoSerializer(producto).data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


# ── Carrito ───────────────────────────────────────────────────────────────────

class AgregarProductoCarritoView(APIView):
    def post(self, request, usuario_id):
        serializer = AgregarProductoCarritoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            CarritoService().agregar_producto(usuario_id, **serializer.validated_data)
            return Response({"mensaje": "Producto agregado al carrito."}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)


class VerCarritoView(APIView):
    def get(self, request, usuario_id):
        try:
            resumen = CarritoService().calcular_total(usuario_id)
            return Response(resumen, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class EliminarProductoCarritoView(APIView):
    def delete(self, request, usuario_id, producto_id):
        CarritoService().eliminar_producto(usuario_id, producto_id)
        return Response({"mensaje": "Producto eliminado del carrito."}, status=status.HTTP_200_OK)


# ── Pedidos ───────────────────────────────────────────────────────────────────

class CrearPedidoView(APIView):
    def post(self, request):
        serializer = CrearPedidoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            pedido = PedidoService().crear_pedido(serializer.validated_data)
            return Response({"id": pedido.id, "total": float(pedido.total), "estado": pedido.estado}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)


class ListarPedidosView(APIView):
    def get(self, request, usuario_id):
        pedidos = PedidoService().listar_pedidos_usuario(usuario_id)
        data = PedidoSerializer(pedidos, many=True).data
        return Response(data, status=status.HTTP_200_OK)


# ── Recomendaciones ───────────────────────────────────────────────────────────

class RecomendacionesView(APIView):
    def get(self, request, usuario_id):
        try:
            recomendados = RecomendacionService().generar_recomendacion(usuario_id)
            return Response({"recomendaciones": recomendados}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)