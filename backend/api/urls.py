from django.contrib import admin
from django.urls import path, include
from . import views


from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import TodoListView,TodoDetailView


from .views import sent_reset_email,reset_password



urlpatterns = [
    path('login/', views.login_view, name='login'),
    path("register/", views.register_list_create, name="Register-view-create"),
    
    path("password-reset/" ,sent_reset_email,name="password_reset"),
    path("password-reset-confirm/<uidb64>/<token>/",reset_password, name="password_reset_confirm"),

    path('todos/', TodoListView.as_view(), name='todo_list_create'),
    path('todos/<int:pk>/', TodoDetailView.as_view(), name='todo_detail'),
]
