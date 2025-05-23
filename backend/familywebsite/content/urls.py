from django.urls import path
from . import views

urlpatterns = [
    path('familymembers/', views.FamilyMemberListCreateView.as_view(), name='familymember-list-create'),
    path('familymembers/<int:pk>/', views.FamilyMemberRetrieveUpdateDestroyView.as_view(), name='familymember-retrieve-update-destroy'),
    path('recipes/', views.RecipeListCreateView.as_view(), name='recipe-list-create'),
    path('recipes/<int:pk>/', views.RecipeRetrieveUpdateDestroyView.as_view(), name='recipe-retrieve-update-destroy'),
    path('pictures/', views.PictureListCreateView.as_view(), name='picture-list-create'),
    path('pictures/<int:pk>/', views.PictureRetrieveUpdateDestroyView.as_view(), name='picture-retrieve-update-destroy'),
    path('videos/', views.VideoListCreateView.as_view(), name='video-list-create'),
    path('videos/<int:pk>/', views.VideoRetrieveUpdateDestroyView.as_view(), name='video-retrieve-update-destroy'),
    path('comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentRetrieveUpdateDestroyView.as_view(), name='comment-retrieve-update-destroy'),
    path('recipealbums/', views.RecipeAlbumListCreateView.as_view(), name='recipealbum-list-create'),
    path('recipealbums/<int:pk>/', views.RecipeAlbumRetrieveUpdateDestroyView.as_view(), name='recipealbum-retrieve-update-destroy'),
    path('mediaalbums/', views.MediaAlbumListCreateView.as_view(), name='mediaalbum-list-create'),
    path('mediaalbums/<int:pk>/', views.MediaAlbumRetrieveUpdateDestroyView.as_view(), name='mediaalbum-retrieve-update-destroy'),
    path('meal-types/', views.MealTypeListCreateView.as_view(), name='mealtype-list-create'),
    path('user/theme/', views.UserThemeUpdateView.as_view(), name='user-theme-update'),
    path('recipes/generate-thumbnail/', views.google_api_search, name='generate-recipe-thumbnail'),
]