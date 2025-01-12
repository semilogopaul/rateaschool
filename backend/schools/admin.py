from django.contrib import admin
from .models import School, Rating, Comment

# Register your models here.
admin.site.register(School)
admin.site.register(Rating)
admin.site.register(Comment)