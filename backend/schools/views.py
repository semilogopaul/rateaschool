from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions, filters
from .permissions import IsOwnerOrReadOnly
from .models import School, Rating, Comment
from .serializers import SchoolSerializer, RatingSerializer, CommentSerializer

class SchoolListCreateView(generics.ListCreateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'location']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

class SchoolDetailView(generics.RetrieveAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Comment.objects.all()
        school_id = self.request.query_params.get('school')  # Get the school ID from query params
        if school_id:
            queryset = queryset.filter(school_id=school_id)  # Filter comments by school ID
        return queryset

    def perform_create(self, serializer):
        school_id = self.request.data.get('school')  # Get school ID from request
        school = School.objects.get(pk=school_id)  # Ensure the school exists
        serializer.save(user=self.request.user, school=school)

class RatingListCreateView(generics.ListCreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Rating.objects.all()
        school_id = self.request.query_params.get('school')  # Get the school ID from query params
        if school_id:
            queryset = queryset.filter(school_id=school_id)  # Filter ratings by school ID
        return queryset

    def perform_create(self, serializer):
        school = serializer.validated_data['school']
        serializer.save(user=self.request.user)

# Comment Update and Delete
class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

# Rating Update and Delete
class RatingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
