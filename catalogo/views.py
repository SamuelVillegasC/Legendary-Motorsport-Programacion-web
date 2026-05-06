from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Vehiculo, CustomUser
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.csrf import csrf_exempt
import json

def index(request):
    return render(request, 'catalogo/index.html')

def catalogo_view(request):
    return render(request, 'catalogo/Catalogo.html')

def contacto_view(request):
    return render(request, 'catalogo/Contacto.html')

def mision_view(request):
    return render(request, 'catalogo/Mision.html')

def vision_view(request):
    return render(request, 'catalogo/Vision.html')

@staff_member_required
def admin_view(request):
    return render(request, 'catalogo/CRUD.html')

def get_vehiculos(request):
    if request.method == 'GET':
        vehiculos = list(Vehiculo.objects.values('id', 'nombre', 'marca', 'precio', 'imagen', 'descripcion', 'badge'))
        return JsonResponse(vehiculos, safe=False)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
@staff_member_required
def crear_auto(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        v = Vehiculo.objects.create(
            nombre=data.get('nombre'),
            marca=data.get('marca'),
            precio=data.get('precio'),
            imagen=data.get('imagen'),
            descripcion=data.get('descripcion'),
            badge=data.get('badge')
        )
        return JsonResponse({'status': 'ok', 'id': v.id})
    return JsonResponse({'status': 'error'}, status=400)

@csrf_exempt
@staff_member_required
def editar_auto(request, vehiculo_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        v = Vehiculo.objects.get(id=vehiculo_id)
        v.nombre = data.get('nombre', v.nombre)
        v.marca = data.get('marca', v.marca)
        v.precio = data.get('precio', v.precio)
        v.imagen = data.get('imagen', v.imagen)
        v.descripcion = data.get('descripcion', v.descripcion)
        v.badge = data.get('badge', v.badge)
        v.save()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'}, status=400)

@csrf_exempt
@staff_member_required
def eliminar_auto(request, vehiculo_id):
    if request.method == 'POST':
        v = Vehiculo.objects.get(id=vehiculo_id)
        v.delete()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'}, status=400)

def check_username(request):
    username = request.GET.get('username', None)
    data = {
        'is_taken': CustomUser.objects.filter(username__iexact=username).exists()
    }
    return JsonResponse(data)

def check_product_name(request):
    nombre = request.GET.get('nombre', None)
    data = {
        'is_taken': Vehiculo.objects.filter(nombre__iexact=nombre).exists()
    }
    return JsonResponse(data)
