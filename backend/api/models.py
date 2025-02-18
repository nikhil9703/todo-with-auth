from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser
from django.db import models

class Register(models.Model):
    username= models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.TextField()


    def __str__(self):
        return self.email

class CustomUser(AbstractUser):
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="customuser_set",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="customuser_permissions_set",
        blank=True
    )