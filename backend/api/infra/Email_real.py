"""
infra/Email_real.py
-------------------
Implementación real con smtplib — usar en PROD.
Configura las variables de entorno en tu .env.
"""
import smtplib
import os
from email.mime.text import MIMEText


class EmailReal:
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_pass = os.getenv("SMTP_PASS", "")

    def _enviar(self, destinatario: str, asunto: str, cuerpo: str):
        msg = MIMEText(cuerpo)
        msg["Subject"] = asunto
        msg["From"] = self.smtp_user
        msg["To"] = destinatario
        try:
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_pass)
                server.sendmail(self.smtp_user, [destinatario], msg.as_string())
        except Exception as e:
            print(f"[EMAIL ERROR] {e}")

    def enviar_confirmacion(self, pedido):
        self._enviar(
            pedido.usuario.email,
            f"Punto Tech - Confirmación pedido #{pedido.id}",
            f"Hola {pedido.usuario.nombre},\n\nTu pedido #{pedido.id} fue confirmado.\nTotal: ${pedido.total}\n\n¡Gracias!"
        )

    def enviar_notificacion_stock(self, producto):
        self._enviar(
            os.getenv("ADMIN_EMAIL", "admin@puntotech.com"),
            f"Punto Tech - Stock bajo: {producto.nombre}",
            f"El producto '{producto.nombre}' está por debajo del punto de reposición."
        )