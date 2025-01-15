from django.urls import path
from .views import SchoolListCreateView, SchoolDetailView, RatingListCreateView, CommentListCreateView, CommentDetailView, RatingDetailView

urlpatterns = [
    path('', SchoolListCreateView.as_view(), name='school-list-create'),
    path('<int:pk>/', SchoolDetailView.as_view(), name='school-detail'),
    path('ratings/', RatingListCreateView.as_view(), name='rating-create'),
    path('comments/', CommentListCreateView.as_view(), name='comment-create'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
    path('ratings/<int:pk>/', RatingDetailView.as_view(), name='rating-detail'),
]
