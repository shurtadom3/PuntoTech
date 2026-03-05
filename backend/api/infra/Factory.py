"""
infra/Factory.py
----------------
Decide en tiempo de ejecución si usa email real (PROD) o mock (DEV).
"""
import os
from api.infra.Email_real import EmailReal 
from api.infra.Email_mock import EmailMock


class NotificadorFactory:

    @staticmethod
    def crear():
        env = os.getenv("ENV_TYPE", "DEV").upper()
        if env == "PROD":
            return EmailReal()
        else:
            return EmailMock()