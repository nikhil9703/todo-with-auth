from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path("register/",views.register_list_create,name="Register-view-create")

]