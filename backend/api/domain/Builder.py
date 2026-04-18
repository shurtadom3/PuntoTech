
from decimal import Decimal

class OrderBuilder:

    def __init__(self):
        self._user_id = None
        self._products = []
        self._address = ""
        self._total = Decimal("0.00")

    def for_user(self, user_id: str) -> "OrderBuilder":
        if not user_id:
            raise ValueError("The order must have an associated user.")
        self._user_id = user_id
        return self

    def with_products(self, products: list) -> "OrderBuilder":
        if not products:
            raise ValueError("The order must contain at least one product.")
        self._products = products
        return self

    def with_address(self, address: str) -> "OrderBuilder":
        if not address or len(address.strip()) < 5:
            raise ValueError("The shipping address is not valid.")
        self._address = address.strip()
        return self

    def calculate_total(self) -> "OrderBuilder":
        if not self._products:
            raise ValueError("No products to calculate the total.")
        self._total = sum(
            p["product"].price * p["quantity"]
            for p in self._products
        )
        return self

    def build(self):
        if self._total <= 0:
            raise ValueError("The order total must be greater than zero.")
        if not self._user_id:
            raise ValueError("The order has no user.")
        if not self._address:
            raise ValueError("The order has no shipping address.")

        from api.models import Order, OrderDetail

        order = Order.objects.create(
            user_id=self._user_id,
            total=self._total,
            shipping_address=self._address,
            status="pending",
        )

        for item in self._products:
            OrderDetail.objects.create(
                order=order,
                product=item["product"],
                quantity=item["quantity"],
                unit_price=item["product"].price,
            )

        return order