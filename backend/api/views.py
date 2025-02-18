from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Register
from .serializer import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password

@api_view(['GET', 'POST'])
def register_list_create(request):
    if request.method == 'GET':
        registers = Register.objects.all()
        serializer = RegisterSerializer(registers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        user = Register.objects.get(username=username)  # Fetch user from Register model
    except Register.DoesNotExist:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    # Verify password using check_password()
    if check_password(password, user.password):
        refresh = RefreshToken.for_user(user)  # JWT token generation
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {'id': user.id, 'username': user.username, 'email': user.email}
        }, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)