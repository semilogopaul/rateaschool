from rest_framework import serializers
from .models import School, Rating, Comment

class SchoolSerializer(serializers.ModelSerializer):
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = School
        fields = ['id', 'name', 'description', 'location', 'image', 'average_rating']

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'school', 'user', 'text', 'created_at', 'updated_at']


class RatingSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Rating
        fields = ['id', 'school', 'user', 'stars', 'created_at', 'updated_at']