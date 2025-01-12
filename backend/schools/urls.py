from django.urls import path
from .views import SchoolListCreateView, SchoolDetailView, RatingCreateView, CommentCreateView, CommentDetailView, RatingDetailView

urlpatterns = [
    path('', SchoolListCreateView.as_view(), name='school-list-create'),
    path('<int:pk>/', SchoolDetailView.as_view(), name='school-detail'),
    path('rate/', RatingCreateView.as_view(), name='rating-create'),
    path('comments/', CommentCreateView.as_view(), name='comment-create'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
    path('ratings/<int:pk>/', RatingDetailView.as_view(), name='rating-detail'),
]
