from rest_framework import generics, status
from django.shortcuts import render
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import (FamilyMember, Recipe, Picture, Video, Comment, RecipeAlbum, MediaAlbum, MealType)
from .serializers import (FamilyMemberSerializer, RecipeSerializer, PictureSerializer, VideoSerializer,
                          CommentSerializer, RecipeAlbumSerializer, MediaAlbumSerializer, UserSerializer, MealTypeSerializer)
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, BasePermission, SAFE_METHODS
from rest_framework.pagination import PageNumberPagination
import urllib.parse
import requests
from bs4 import BeautifulSoup
from django.core.cache import cache
from django.http import JsonResponse
import os
from django.http import HttpResponse

# Create your views here.
#User = get_user_model()

class ItemPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

class IsApprovedUser(BasePermission):
    '''
    
    Allows any user to make read-only requests (SAFE_METHODS: GET, HEAD, OPTIONS).
    Restricts modify actions (POST, PUT, DELETE) to approved users only.

    '''

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS: # Read only methods
            return True
        return request.user.is_authenticated and request.user.is_approved # Modify actions

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
    queryset = Recipe.objects.order_by('-date_uploaded') # Newest first
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = ItemPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Automatically assign the authenticated user

class RecipeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class PictureListCreateView(generics.ListCreateAPIView):
    queryset = Picture.objects.order_by('-date_uploaded') # Newest first
    serializer_class = PictureSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsApprovedUser]
    pagination_class = ItemPagination

    def create(self, request, *args, **kwargs):
        files = request.FILES.getlist('image')
        if not files:
            return Response({'error': 'No files were uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        picture_instances = []
        for file in files:
            serializer = self.get_serializer(data={'image': file, 'user': request.user.id})
            serializer.is_valid(raise_exception=True)
            picture_instance = serializer.save(user=self.request.user)
            picture_instances.append(picture_instance)
        
        return Response(self.get_serializer(picture_instances, many=True).data, status=status.HTTP_201_CREATED)

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

class MealTypeListCreateView(generics.ListCreateAPIView):
    queryset = MealType.objects.all()
    serializer_class = MealTypeSerializer
    permission_classes = [IsAuthenticated]

import re

def google_api_search(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'GET request required'}, status=status.HTTP_400_BAD_REQUEST)
    
    query = request.GET.get('q', '')
    num = int(request.GET.get('num', 20))  # Default to 20 images if not specified
    page = int(request.GET.get('page', 1))  # Default to page 1 if not specified
    if not query:
        return JsonResponse({'error': 'No recipe title provided'}, status=status.HTTP_400_BAD_REQUEST)
    if num < 1:
        return JsonResponse({'error': 'Invalid num parameter'}, status=status.HTTP_400_BAD_REQUEST)
    if page < 1:
        return JsonResponse({'error': 'Invalid page parameter'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if query exists in blacklist (import from banned_queries.txt)

    def contains_prohibited_words(query):
        with open(r'C:\Users\conne\Documents\GitHub\FamilyWebsite\backend\familywebsite\content\banned_queries.txt', 'r') as f:
            prohibited_words = f.read().splitlines()
        query = query.lower()
        for word in prohibited_words:
            if re.search(r'\b' + re.escape(word) + r'\b', query):
                return True
        return False

    if contains_prohibited_words(query):
        return JsonResponse({'error': 'Query is banned'}, status=status.HTTP_403_FORBIDDEN)

    cache_key = f"google_image_search_{query}".replace(' ', '%20')
    cached_results = cache.get(cache_key)
    start_index = num * (page - 1)
    end_index = start_index + num

    API_KEY = os.environ.get('Google_Search_Engine_API_Key')
    SEARCH_ENGINE_ID = os.environ.get('Google_Search_Engine_ID')
    #SEARCH_ENGINE_ID = '91b06eb59e9f147d8'
    url = "https://www.googleapis.com/customsearch/v1"
    max_per_request = 10  # Google API allows max 10 images per request
    batch_size = 50

    if cached_results:
        # If end_index exceeds cache, fetch more and extend cache
        while end_index > len(cached_results):
            fetch_start = len(cached_results) + 1
            results = []
            while len(results) < batch_size:
                params = {
                    "q": query,
                    "key": API_KEY,
                    "cx": SEARCH_ENGINE_ID,
                    "searchType": "image",
                    "num": min(max_per_request, batch_size - len(results)),
                    "start": fetch_start + len(results),
                }
                response = requests.get(url, params=params)
                if response.status_code != 200:
                    break
                data = response.json()
                items = data.get("items", [])
                results.extend([item["link"] for item in items])
                if not items or "queries" not in data or "nextPage" not in data["queries"]:
                    break
            if not results:
                break
            cached_results.extend(results)
            cache.set(cache_key, cached_results, timeout=60*60)
        return JsonResponse({'images': cached_results[start_index:end_index]}, status=status.HTTP_200_OK)

    # No cache, fetch initial batch
    results = []
    fetch_start = 1
    while len(results) < batch_size:
        params = {
            "q": query,
            "key": API_KEY,
            "cx": SEARCH_ENGINE_ID,
            "searchType": "image",
            "num": min(max_per_request, batch_size - len(results)),
            "start": fetch_start + len(results),
        }
        response = requests.get(url, params=params)
        if response.status_code != 200:
            break
        data = response.json()
        items = data.get("items", [])
        results.extend([item["link"] for item in items])
        if not items or "queries" not in data or "nextPage" not in data["queries"]:
            break
    cache.set(cache_key, results, timeout=60*60)
    return JsonResponse({'images': results[start_index:end_index]}, status=status.HTTP_200_OK)

def download_external_file(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'GET request required'}, status=status.HTTP_400_BAD_REQUEST)
    url = request.GET.get('url', '')
    if not url:
        return JsonResponse({'error': 'No URL provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    # download the image file using src url as address
    headers = {
        'User-Agent': (
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/113.0.0.0 Safari/537.36'
        )
    }
    try:
        response = requests.get(url, headers=headers, timeout=5)
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    if response.status_code != 200:
        return JsonResponse({'error': 'Failed to download file'}, status=response.status_code)
    content_type = response.headers.get('Content-Type', '')
    if 'image' not in content_type:
        return JsonResponse({'error': 'URL does not point to an image'}, status=status.HTTP_400_BAD_REQUEST)

    return HttpResponse(
        response.content,
        content_type=content_type
    )