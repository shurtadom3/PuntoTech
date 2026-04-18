from django.contrib import admin

# Register your models here.
from .models import User, UserProfile, Category, Product, Order, Cart, CartItem, Stock, OrderDetail
admin.site.register(User)
admin.site.register(UserProfile)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Stock)
admin.site.register(OrderDetail)