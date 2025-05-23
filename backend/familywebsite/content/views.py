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
'''
def generate_recipe_thumbnail(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'GET request required'}, status=status.HTTP_400_BAD_REQUEST)
    search_query = request.GET.get('q', '')

    if not search_query:
        return JsonResponse({'error': 'No search query provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    cache_key = f"image_search_{search_query}"
    cached_result = cache.get(cache_key)
    if cached_result:
        return JsonResponse({'images': cached_result}, status=status.HTTP_200_OK)

    try:
        # Prepare the search URL
        encoded_query = urllib.parse.quote_plus(search_query)
        url = f"https://www.google.com/search?q={encoded_query}&tbm=isch"

        # Set headers to mimic a browser
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

        # Make the request to Google Images
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for bad responses

        # Parse the response content to find image URLs
        soup = BeautifulSoup(response.text, 'html5lib')
        images = soup.find_all('img')
        print(f"Found {len(images)} images")

        # Extract image URLs (filter out placeholder images)
        image_urls = []
        for img in images:
            src = img.get('src')
            #if src and src.startswith('http') and not src.startswith('data:'):
            if src and not src.startswith('data:image/gif'):
                image_urls.append(src)
        print(f"Extracted {len(image_urls)} valid image URLs")

        result = {'images': image_urls[:20]}  # Limit to the first 20 images
        # Cache the result for 1 hour (3600 seconds)
        #FIXME: cache.set(cache_key, result, timeout=60*60)  # Cache the result for 1 hour
        
        # Return the first 20 image URLs as a response
        return JsonResponse({'images': image_urls[:20]}, status=status.HTTP_200_OK)
    except requests.RequestException as e:
        return JsonResponse({'error': f"Request failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return JsonResponse({'error': f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
'''
def google_api_search(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'GET request required'}, status=status.HTTP_400_BAD_REQUEST)
    
    query = request.GET.get('q', '')
    num = int(request.GET.get('num', 20))  # Default to 20 images if not specified
    page = int(request.GET.get('page', 1))  # Default to page 1 if not specified
    if not query:
        return JsonResponse({'error': 'No search query provided'}, status=status.HTTP_400_BAD_REQUEST)

    cache_key = f"google_image_search_{query}"
    cached_results = cache.get(cache_key)
    if cached_results:
        print(f"Cache hit for query: {query}")
        start_index = num * (page - 1)
        end_index = start_index + num
        return JsonResponse({'images': cached_results[start_index:end_index]}, status=status.HTTP_200_OK)

    url = "https://www.googleapis.com/customsearch/v1"
    API_KEY = os.environ.get('Google_Search_Engine_API_Key')
    SEARCH_ENGINE_ID = os.environ.get('Google_Search_Engine_ID')
    results = []
    start_index = 1
    max_per_request = 10  # Google API allows max 10 images per request
    total_to_fetch = num if num > 50 else 50

    while len(results) < total_to_fetch:
        params = {
            "q": query,
            "key": API_KEY,
            "cx": SEARCH_ENGINE_ID,
            "searchType": "image",
            "num": min(max_per_request, total_to_fetch - len(results)),
            "start": start_index
        }
        response = requests.get(url, params=params)
        if response.status_code != 200:
            break
        data = response.json()
        items = data.get("items", [])
        results.extend([item["link"] for item in items])
        if not items or "queries" not in data or "nextPage" not in data["queries"]:
            break
        start_index = data["queries"]["nextPage"][0].get("startIndex", start_index + len(items))

    # Cache the results (all 50 or less if not enough found)
    cache.set(cache_key, results, timeout=60*60)  # Cache for 1 hour

    return JsonResponse({'images': results[:num]}, status=status.HTTP_200_OK)