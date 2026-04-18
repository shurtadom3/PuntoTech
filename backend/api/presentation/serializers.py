
from rest_framework import serializers
from api.models import Product, Order, OrderDetail


class UserRegistrationSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    budget = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    usage_type = serializers.CharField(max_length=100, required=False, default="")
    preferred_brands = serializers.CharField(max_length=255, required=False, default="")


class UpdateProfileSerializer(serializers.Serializer):
    budget = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    usage_type = serializers.CharField(max_length=100, required=False)
    preferred_brands = serializers.CharField(max_length=255, required=False)


class AddCartItemSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1)


class CreateOrderSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    shipping_address = serializers.CharField(min_length=5)


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    available_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "brand", "price", "description", "category", "available_stock"]

    def get_available_stock(self, obj):
        try:
            return obj.stock.available_quantity
        except Exception:
            return None


class OrderDetailSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField()

    class Meta:
        model = OrderDetail
        fields = ["product", "quantity", "unit_price"]


class OrderSerializer(serializers.ModelSerializer):
    details = OrderDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "date", "status", "total", "shipping_address", "details"]