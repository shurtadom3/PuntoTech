"""
infra/Email_mock.py
-------------------
Implementación Mock — imprime por consola en DEV/TEST.
"""


class EmailMock:
    def enviar_confirmacion(self, pedido):
        print(f"[MOCK EMAIL] Pedido {pedido.id} confirmado. Total: ${pedido.total}")

    def enviar_notificacion_stock(self, producto):
        print(f"[MOCK EMAIL] Stock bajo para: {producto.nombre}")