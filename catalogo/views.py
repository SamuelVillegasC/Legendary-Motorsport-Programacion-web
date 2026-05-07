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

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password

def login_page(request):
    return render(request, 'catalogo/Login.html')

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'status': 'ok', 'rol': user.rol})
        else:
            return JsonResponse({'status': 'error', 'message': 'Credenciales inválidas'}, status=401)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def api_register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        
        if CustomUser.objects.filter(username__iexact=username).exists():
            return JsonResponse({'status': 'error', 'message': 'El nombre de usuario ya está en uso'}, status=400)
            
        user = CustomUser.objects.create(
            username=username,
            password=make_password(data.get('password')),
            email=data.get('email', ''),
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            direccion=data.get('direccion', ''),
            rol='user'
        )
        login(request, user)
        return JsonResponse({'status': 'ok', 'rol': user.rol})
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def api_logout(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'error': 'Método no permitido'}, status=405)

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

@staff_member_required
def get_usuarios(request):
    if request.method == 'GET':
        usuarios = list(CustomUser.objects.values('id', 'username', 'first_name', 'last_name', 'email', 'direccion', 'rol'))
        return JsonResponse(usuarios, safe=False)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
@staff_member_required
def editar_usuario(request, user_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            u = CustomUser.objects.get(id=user_id)
            u.username = data.get('username', u.username)
            u.first_name = data.get('first_name', u.first_name)
            u.last_name = data.get('last_name', u.last_name)
            u.email = data.get('email', u.email)
            u.direccion = data.get('direccion', u.direccion)
            u.rol = data.get('rol', u.rol)
            u.save()
            return JsonResponse({'status': 'ok'})
        except CustomUser.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Usuario no encontrado'}, status=404)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
@staff_member_required
def eliminar_usuario(request, user_id):
    if request.method == 'POST':
        try:
            u = CustomUser.objects.get(id=user_id)
            if request.user.id == u.id:
                return JsonResponse({'status': 'error', 'message': 'No puedes eliminarte a ti mismo'}, status=400)
            u.delete()
            return JsonResponse({'status': 'ok'})
        except CustomUser.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Usuario no encontrado'}, status=404)
    return JsonResponse({'error': 'Método no permitido'}, status=405)
