from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import TodoItemViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


from .views import sent_reset_email,reset_password

router = DefaultRouter()
router.register(r'todos', TodoItemViewSet)

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path("register/", views.register_list_create, name="Register-view-create"),
    
    path("password-reset/" ,sent_reset_email,name="password_reset"),
    path("password-reset-confirm/<uidb64>/<token>/",reset_password, name="password_reset_confirm"),


    # JWT Token URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
