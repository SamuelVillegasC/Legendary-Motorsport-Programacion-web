from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # AbstractUser ya incluye username, first_name, last_name, email, password
    direccion = models.CharField(max_length=255, blank=True, null=True)
    
    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )
    rol = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def save(self, *args, **kwargs):
        if self.rol == 'admin':
            self.is_staff = True
            self.is_superuser = True
        else:
            self.is_staff = False
            self.is_superuser = False
        super().save(*args, **kwargs)

class Vehiculo(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    marca = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    imagen = models.URLField(max_length=500, blank=True, null=True)
    descripcion = models.TextField()
    badge = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.marca} {self.nombre}"
