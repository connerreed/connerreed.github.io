from rest_framework import generics
from django.shortcuts import render
from django.contrib.auth import get_user_model
from .models import (FamilyMember, Recipe, Picture, Video, Comment, RecipeAlbum, MediaAlbum)
from .serializers import (FamilyMemberSerializer, RecipeSerializer, PictureSerializer, VideoSerializer,
                          CommentSerializer, RecipeAlbumSerializer, MediaAlbumSerializer, UserSerializer)
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

# Create your views here.
#User = get_user_model()

class UserThemeUpdateView(generics.RetrieveUpdateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class FamilyMemberListCreateView(generics.ListCreateAPIView):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class FamilyMemberRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RecipeListCreateView(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RecipeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class PictureListCreateView(generics.ListCreateAPIView):
    queryset = Picture.objects.order_by('-date_uploaded') # Newest first
    serializer_class = PictureSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Automatically assign the authenticated user

class PictureRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Picture.objects.all()
    serializer_class = PictureSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class VideoListCreateView(generics.ListCreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class VideoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RecipeAlbumListCreateView(generics.ListCreateAPIView):
    queryset = RecipeAlbum.objects.all()
    serializer_class = RecipeAlbumSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RecipeAlbumRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RecipeAlbum.objects.all()
    serializer_class = RecipeAlbumSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MediaAlbumListCreateView(generics.ListCreateAPIView):
    queryset = MediaAlbum.objects.all()
    serializer_class = MediaAlbumSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MediaAlbumRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MediaAlbum.objects.all()
    serializer_class = MediaAlbumSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]