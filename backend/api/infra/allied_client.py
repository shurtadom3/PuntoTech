import requests
from django.conf import settings


class AlliedCatalogClient:
    """Client for the allied team's JSON service."""

    def __init__(self, base_url=None, timeout=5):
        self.base_url = (base_url or settings.ALLIED_SERVICE_URL).rstrip("/")
        self.timeout = timeout

    def get_catalog(self):
        if not self.base_url:
            return {
                "source": "demo",
                "message": "Configure ALLIED_SERVICE_URL with the allied team's endpoint.",
                "items": [],
            }
        response = requests.get(f"{self.base_url}/api/integracion/catalogo/", timeout=self.timeout)
        response.raise_for_status()
        return response.json()
