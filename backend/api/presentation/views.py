
from django.http import JsonResponse
from django.utils.translation import gettext as _
from requests import RequestException
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.application.services import (
    UserService, ProductService,
    CartService, OrderService, RecommendationService, IntegrationService
)
from api.presentation.serializers import (
    UserLoginSerializer, UserRegistrationSerializer, UpdateProfileSerializer,
    AddCartItemSerializer, CreateOrderSerializer,
    ProductSerializer, OrderSerializer
)

def health(request):
    return JsonResponse({"status": "ok", "message": _("Django connected")})


# ── Users ─────────────────────────────────────────────────────────────────────

class RegisterUserView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = UserService().register(serializer.validated_data)
            return Response({"id": user.id, "email": user.email}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)


class LoginUserView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = UserService().login(**serializer.validated_data)
            return Response({"id": user.id, "name": user.name, "email": user.email}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class UpdateProfileView(APIView):
    def put(self, request, usuario_id):
        serializer = UpdateProfileSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            profile = UserService().update_profile(usuario_id, serializer.validated_data)
            return Response({"message": _("Profile updated"), "usage_type": profile.usage_type}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


# ── Products ──────────────────────────────────────────────────────────────────

class ListProductsView(APIView):
    def get(self, request):
        products = ProductService().list_all()
        data = ProductSerializer(products, many=True).data
        return Response(data, status=status.HTTP_200_OK)


class ListProductsByCategoryView(APIView):
    def get(self, request, category_id):
        products = ProductService().list_by_category(category_id)
        data = ProductSerializer(products, many=True).data
        return Response(data, status=status.HTTP_200_OK)


class ProductDetailView(APIView):
    def get(self, request, product_id):
        try:
            product = ProductService().get_detail(product_id)
            return Response(ProductSerializer(product).data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


# ── Cart ──────────────────────────────────────────────────────────────────────

class AddCartItemView(APIView):
    def post(self, request, user_id):
        serializer = AddCartItemSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            CartService().add_product(user_id, **serializer.validated_data)
            return Response({"message": _("Product added to cart.")}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)


class ViewCartView(APIView):
    def get(self, request, user_id):
        try:
            summary = CartService().calculate_total(user_id)
            return Response(summary, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class RemoveCartItemView(APIView):
    def delete(self, request, user_id, product_id):
        CartService().remove_product(user_id, product_id)
        return Response({"message": _("Product removed from cart.")}, status=status.HTTP_200_OK)


# ── Orders ────────────────────────────────────────────────────────────────────

class CreateOrderView(APIView):
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            order_service = OrderService()
            order = order_service.create_order(serializer.validated_data)
            estimated_delivery_date = order_service.get_estimated_delivery_date(order)
            return Response(
                {
                    "id": order.id,
                    "total": float(order.total),
                    "status": order.status,
                    "estimated_delivery_date": estimated_delivery_date.isoformat(),
                    "email_sent": bool(getattr(order, "email_sent", False)),
                    "message": _("Purchase confirmed. We are preparing your order and will email the estimated arrival date."),
                },
                status=status.HTTP_201_CREATED,
            )
        except RuntimeError as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)


class ListOrdersView(APIView):
    def get(self, request, user_id):
        orders = OrderService().list_user_orders(user_id)
        data = OrderSerializer(orders, many=True).data
        return Response(data, status=status.HTTP_200_OK)


# ── Recommendations ───────────────────────────────────────────────────────────

class RecommendationsView(APIView):
    def get(self, request, user_id):
        try:
            recommended = RecommendationService().generate_recommendation(user_id)
            return Response({"recommendations": recommended}, status=status.HTTP_200_OK)
        except RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class PublicCatalogIntegrationView(APIView):
    def get(self, request):
        return Response(IntegrationService().public_catalog(), status=status.HTTP_200_OK)


class AlliedCatalogIntegrationView(APIView):
    def get(self, request):
        try:
            return Response(IntegrationService().allied_catalog(), status=status.HTTP_200_OK)
        except RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


class ExchangeRateView(APIView):
    def get(self, request):
        from_currency = request.query_params.get("from", "USD")
        to_currency = request.query_params.get("to", "COP")
        try:
            data = IntegrationService().exchange_rate(from_currency, to_currency)
            return Response(data, status=status.HTTP_200_OK)
        except (RequestException, ValueError) as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
