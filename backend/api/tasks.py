from celery import shared_task

from api.infra.Factory import NotifierFactory
from api.models import Order, Product


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_order_confirmation_task(self, order_id):
    try:
        order = Order.objects.prefetch_related("details__product").select_related("user").get(id=order_id)
        return NotifierFactory.create().send_confirmation(order)
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_low_stock_notification_task(self, product_id):
    try:
        product = Product.objects.get(id=product_id)
        return NotifierFactory.create().send_low_stock_notification(product)
    except Exception as exc:
        raise self.retry(exc=exc)
