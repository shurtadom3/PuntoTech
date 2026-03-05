"""
serializers.py
--------------
Serializers DRF — solo entrada/salida de datos.
Sin lógica de negocio.
"""
from rest_framework import serializers
from api.models import Producto, Pedido, DetallePedido


class UsuarioRegistroSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    presupuesto = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    tipo_uso = serializers.CharField(max_length=100, required=False, default="")
    marcas_preferidas = serializers.CharField(max_length=255, required=False, default="")


class ActualizarPerfilSerializer(serializers.Serializer):
    presupuesto = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    tipo_uso = serializers.CharField(max_length=100, required=False)
    marcas_preferidas = serializers.CharField(max_length=255, required=False)


class AgregarProductoCarritoSerializer(serializers.Serializer):
    producto_id = serializers.CharField()
    cantidad = serializers.IntegerField(min_value=1)


class CrearPedidoSerializer(serializers.Serializer):
    usuario_id = serializers.CharField()
    direccion_envio = serializers.CharField(min_length=5)


class ProductoSerializer(serializers.ModelSerializer):
    categoria = serializers.StringRelatedField()
    stock_disponible = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = ["id", "nombre", "marca", "precio", "descripcion", "categoria", "stock_disponible"]

    def get_stock_disponible(self, obj):
        try:
            return obj.stock.cantidad_disponible
        except Exception:
            return None


class DetallePedidoSerializer(serializers.ModelSerializer):
    producto = serializers.StringRelatedField()

    class Meta:
        model = DetallePedido
        fields = ["producto", "cantidad", "precio_unitario"]


class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = ["id", "fecha", "estado", "total", "direccion_envio", "detalles"]