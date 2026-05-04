from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('catalogo/', views.catalogo_view, name='catalogo'),
    path('contacto/', views.contacto_view, name='contacto'),
    path('mision/', views.mision_view, name='mision'),
    path('vision/', views.vision_view, name='vision'),
    path('admin_panel/', views.admin_view, name='admin_panel'),
    path('api/check_username/', views.check_username, name='check_username'),
    path('api/check_product_name/', views.check_product_name, name='check_product_name'),
]
