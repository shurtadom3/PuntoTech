
import smtplib
import os
from email.mime.text import MIMEText


class EmailReal:
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_pass = os.getenv("SMTP_PASS", "")

    def _send(self, recipient: str, subject: str, body: str):
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = self.smtp_user
        msg["To"] = recipient
        try:
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_pass)
                server.sendmail(self.smtp_user, [recipient], msg.as_string())
        except Exception as e:
            print(f"[EMAIL ERROR] {e}")

    def send_confirmation(self, order):
        self._send(
            order.user.email,
            f"Puntotech - Order confirmation #{order.id}",
            f"Hello {order.user.name},\n\nYour order #{order.id} has been confirmed.\nTotal: ${order.total}\n\nThank you!"
        )

    def send_low_stock_notification(self, product):
        self._send(
            os.getenv("ADMIN_EMAIL", "admin@puntotech.com"),
            f"Puntotech - Low stock: {product.name}",
            f"The product '{product.name}' is below its reorder point."
        )