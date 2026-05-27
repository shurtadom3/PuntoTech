
from datetime import timedelta


class EmailMock:
    def send_confirmation(self, order):
        estimated_date = order.date + timedelta(days=5)
        products = "\n".join(
            f"- {detail.quantity} x {detail.product.name} (${detail.unit_price})"
            for detail in order.details.select_related("product").all()
        )
        print(
            "[MOCK EMAIL]\n"
            f"Para: {order.user.email}\n"
            f"Asunto: PuntoTech - Confirmacion de compra #{order.id}\n"
            f"Hola {order.user.name},\n\n"
            "Tu producto se compro correctamente.\n"
            "Tu compra fue confirmada y ya estamos preparando el envio.\n\n"
            f"Productos:\n{products}\n\n"
            f"Total: ${order.total}\n"
            f"Direccion de envio: {order.shipping_address}\n"
            f"Fecha estimada de llegada: {estimated_date.isoformat()}\n"
        )
        return False

    def send_low_stock_notification(self, product):
        print(f"[MOCK EMAIL] Low stock for: {product.name}")
        return False
