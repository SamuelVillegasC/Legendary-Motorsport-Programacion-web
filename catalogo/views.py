from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Vehiculo, CustomUser
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required

def index(request):
    return render(request, 'catalogo/index.html')

def catalogo_view(request):
    # Pasar los vehículos desde DB o dejar que vue haga fetch
    vehiculos = list(Vehiculo.objects.values())
    return render(request, 'catalogo/Catalogo.html', {'vehiculos': vehiculos})

def contacto_view(request):
    return render(request, 'catalogo/Contacto.html')

def mision_view(request):
    return render(request, 'catalogo/Mision.html')

def vision_view(request):
    return render(request, 'catalogo/Vision.html')

@staff_member_required
def admin_view(request):
    return render(request, 'catalogo/Admin.html')

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
