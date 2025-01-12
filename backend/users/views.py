from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer
from rest_framework.views import APIView
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from django.conf import settings
from django.core.mail import send_mail
from itsdangerous import URLSafeTimedSerializer
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class VerifyEmailView(APIView):
    def get(self, request):
        token = request.GET.get('token')
        serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
        try:
            email = serializer.loads(token, salt='email-verification-salt', max_age=3600)  # Token valid for 1 hour
            user = User.objects.get(email=email)
            if not user.is_active:
                user.is_active = True
                user.save()
            return Response({"message": "Email successfully verified!"}, status=status.HTTP_200_OK)
        except SignatureExpired:
            return Response({"error": "Token has expired."}, status=status.HTTP_400_BAD_REQUEST)
        except BadSignature:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_200_OK)

class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
            token = serializer.dumps(user.email, salt='password-reset-salt')

            # Create password reset link
            reset_link = f"http://localhost:8000/api/users/reset-password/?token={token}"
            email_body = f"Hi {user.first_name},\nUse the link below to reset your password:\n{reset_link}"
            
            send_mail(
                subject='Password Reset Request',
                message=email_body,
                from_email='noreply@demomailtrap.com',
                recipient_list=[user.email],
            )
            return Response({"message": "Password reset link sent to your email."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Email not registered."}, status=status.HTTP_400_BAD_REQUEST)
        
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
        try:
            email = serializer.loads(token, salt='password-reset-salt', max_age=3600)
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successful!"}, status=status.HTTP_200_OK)
        except SignatureExpired:
            return Response({"error": "Token has expired."}, status=status.HTTP_400_BAD_REQUEST)
        except BadSignature:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


