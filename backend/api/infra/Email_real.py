
import smtplib
import os
from datetime import timedelta
from email.mime.text import MIMEText


class EmailReal:
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_pass = os.getenv("SMTP_PASS", "")

    def _send(self, recipient: str, subject: str, body: str):
        if not self.smtp_user or not self.smtp_pass:
            raise RuntimeError("SMTP_USER and SMTP_PASS are required to send real emails.")

        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = self.smtp_user
        msg["To"] = recipient
        try:
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_pass)
                server.sendmail(self.smtp_user, [recipient], msg.as_string())
        except (OSError, smtplib.SMTPException) as exc:
            raise RuntimeError(f"No se pudo enviar el correo real: {exc}") from exc

    def send_confirmation(self, order):
        estimated_date = order.date + timedelta(days=5)
        products = "\n".join(
            f"- {detail.quantity} x {detail.product.name} (${detail.unit_price})"
            for detail in order.details.select_related("product").all()
        )
        self._send(
            order.user.email,
            f"PuntoTech - Confirmacion de compra #{order.id}",
            (
                f"Hola {order.user.name},\n\n"
                "Tu producto se compro correctamente.\n"
                "Tu compra fue confirmada y ya estamos preparando el envio.\n\n"
                f"Productos:\n{products}\n\n"
                f"Total: ${order.total}\n"
                f"Direccion de envio: {order.shipping_address}\n"
                f"Fecha estimada de llegada: {estimated_date.isoformat()}\n\n"
                "Gracias por comprar en PuntoTech."
            )
        )
        return True

    def send_low_stock_notification(self, product):
        self._send(
            os.getenv("ADMIN_EMAIL", "admin@puntotech.com"),
            f"Puntotech - Low stock: {product.name}",
            f"The product '{product.name}' is below its reorder point."
        )
        return True
