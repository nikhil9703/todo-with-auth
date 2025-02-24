from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Register
from .models import TodoItem
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Register
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}  # Password is write-only

    def create(self, validated_data):
        # Ensure the password is hashed before saving
        validated_data['password'] = make_password(validated_data['password'])
        return Register.objects.create(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  # You can add more fields here if needed


class TodoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoItem
        fields = ['id', 'title', 'completed', 'created_at']