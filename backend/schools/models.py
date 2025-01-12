from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Avg

User = get_user_model()

class School(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    location = models.CharField(max_length=255)
    image = models.ImageField(upload_to='school_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        ratings = self.ratings.aggregate(Avg('stars'))
        return round(ratings['stars__avg'], 1) if ratings['stars__avg'] else 0


class Rating(models.Model):
    school = models.ForeignKey(School, related_name='ratings', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='ratings', on_delete=models.CASCADE)
    stars = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('school', 'user')

    def __str__(self):
        return f"{self.user} - {self.school} - {self.stars}"


class Comment(models.Model):
    school = models.ForeignKey(School, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='comments', on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.school}"