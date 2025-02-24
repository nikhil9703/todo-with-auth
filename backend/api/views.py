from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt


from rest_framework import generics, permissions
from .models import Register, Todo
from .serializer import RegisterSerializer, TodoSerializer

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication




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

@api_view(["POST"])
def sent_reset_email(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Register.objects.get(email=email)  # Use the Register model
    except Register.DoesNotExist:
        return Response({"error": "No user found with this email"}, status=status.HTTP_404_NOT_FOUND)

    # Generate password reset token and link
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"

    # Send email
    send_mail(
        "Password Reset Request",
        f"Click the link to reset your password: {reset_link}",
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

    return Response({"message": "Password reset email sent"}, status=status.HTTP_200_OK)

@api_view(["POST"])
def reset_password(request, uidb64, token):
    try:
        # Decode the UID and fetch the user
        uid = urlsafe_base64_decode(uidb64).decode()
        user = Register.objects.get(pk=uid)  # Use the Register model

        # Verify the token
        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        # Set the new password
        new_password = request.data.get("password")
        if not new_password:
            return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)

    except Register.DoesNotExist:
        return Response({"error": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
class TodoListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Log the request and user
        print(f"Request user: {request.user}")
        
        # Fetch all todos for the authenticated user
        todos = Todo.objects.filter(user=request.user)  # Assuming 'user' field in your Todo model
        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Handle creating a new todo
        serializer = TodoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Save with the authenticated user
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class TodoDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            todo = Todo.objects.get(pk=pk, user=request.user)
            todo.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Todo.DoesNotExist:
            return Response({"error": "Todo not found"}, status=status.HTTP_404_NOT_FOUND)