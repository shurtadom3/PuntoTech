

class EmailMock:
    def send_confirmation(self, order):
        print(f"[MOCK EMAIL] Order {order.id} confirmed. Total: ${order.total}")

    def send_low_stock_notification(self, product):
        print(f"[MOCK EMAIL] Low stock for: {product.name}")