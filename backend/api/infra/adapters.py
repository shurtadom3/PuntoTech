from decimal import Decimal

import requests
from django.conf import settings


class ExchangeRateAdapter:
    """Adapter for the third-party exchange-rate API."""

    def __init__(self, base_url=None, timeout=5):
        self.base_url = base_url or settings.EXTERNAL_RATE_API_URL
        self.timeout = timeout

    def get_rate(self, from_currency="USD", to_currency="COP"):
        response = requests.get(
            self.base_url,
            params={"from": from_currency, "to": to_currency},
            timeout=self.timeout,
        )
        response.raise_for_status()
        payload = response.json()
        rate = payload.get("rates", {}).get(to_currency)
        if rate is None:
            raise ValueError(f"Rate {from_currency}-{to_currency} not found in provider response.")
        return {
            "provider": self.base_url,
            "from": from_currency,
            "to": to_currency,
            "rate": str(Decimal(str(rate))),
            "date": payload.get("date"),
        }
