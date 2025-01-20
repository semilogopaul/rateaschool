from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from itsdangerous import URLSafeTimedSerializer
from django.conf import settings

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    permission_classes = [AllowAny]
    username = serializers.CharField(required=True)  # Add username field
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'username', 'password', 'confirm_password')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        user.is_active = True  # User must verify email first
        user.save()

        # Generate verification token
        serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
        token = serializer.dumps(user.email, salt='email-verification-salt')

        # Send email with verification link
        absurl = f"http://localhost:8000/api/users/verify-email/?token={token}"
        email_body = f"Hi {user.first_name},\nUse the link below to verify your email:\n{absurl}"
        send_mail(
            'Verify your email',
             message=email_body,
                from_email='okiki.adeogun@gmail.com',
                recipient_list=[user.email],
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = User.objects.filter(email=data['email']).first()
        if user and user.check_password(data['password']):
            if not user.is_active:
                raise serializers.ValidationError("Account is not verified.")
            return user
        raise serializers.ValidationError("Invalid credentials.")
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'username')
        read_only_fields = ('email', 'username')

