"""
infra/Factory.py
----------------
Decides at runtime whether to use real email (PROD) or mock (DEV).
"""
import os
from api.infra.email_real import EmailReal
from api.infra.email_mock import EmailMock


class NotifierFactory:

    @staticmethod
    def create():
        env = os.getenv("ENV_TYPE", "DEV").upper()
        has_smtp_credentials = bool(os.getenv("SMTP_USER") and os.getenv("SMTP_PASS"))
        if env == "PROD" or has_smtp_credentials:
            return EmailReal()
        return EmailMock()
