from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('catalogo/', views.catalogo_view, name='catalogo'),
    path('contacto/', views.contacto_view, name='contacto'),
    path('mision/', views.mision_view, name='mision'),
    path('vision/', views.vision_view, name='vision'),
    path('CRUD/', views.admin_view, name='admin'),
    path('api/check_username/', views.check_username, name='check_username'),
    path('api/check_product_name/', views.check_product_name, name='check_product_name'),
    path('api/vehiculos/', views.get_vehiculos, name='get_vehiculos'),
    path('crear_auto/', views.crear_auto, name='crear_auto'),
    path('editar_auto/<int:vehiculo_id>/', views.editar_auto, name='editar_auto'),
    path('eliminar_auto/<int:vehiculo_id>/', views.eliminar_auto, name='eliminar_auto'),
]
