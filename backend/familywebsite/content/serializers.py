import os
from rest_framework import serializers
from .models import (FamilyMember, Recipe, RecipeContentImage, MealType, Picture, Video, Comment,
                     RecipeAlbum, MediaAlbum)
from djoser.serializers import UserSerializer as BaseUserSerializer, UserCreateSerializer as BaseUserCreateSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(BaseUserSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'prefers_dark_mode', 'is_approved', 'is_active', 'date_joined', 'last_login', 'is_superuser', 'groups']

class RecipeContentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeContentImage
        fields = ['id', 'image']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['recipe_title'] = instance.recipe.title  # Adding the recipe title to the representation
        return representation

class RecipeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=True
    )
    serialized_images = RecipeContentImageSerializer(
        many=True,
        read_only=True,
        source="images"
    )
    mealType = serializers.SlugRelatedField(
        slug_field='name',
        queryset=MealType.objects.all(),
        many=True
    )

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'user','recipeAuthor',
                  'mealType', 'featured', 'thumbnail', 'thumbnail_transformed', 'images', 'serialized_images', 'date_uploaded']
        depth = 1

    def create(self, validated_data):
        meal_type_data = validated_data.pop('mealType', [])
        images_data = validated_data.pop('images', [])

        recipe = Recipe.objects.create(**validated_data)

        if meal_type_data:
            recipe.mealType.set(meal_type_data)

        for image in images_data:
            RecipeContentImage.objects.create(recipe=recipe, image=image)
            
        return recipe

    def update(self, instance, validated_data):
        meal_type_data = validated_data.pop('mealType', None)
        images_data = validated_data.pop('images', None)

        # Update Recipe fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update 'mealType' if provided
        if meal_type_data is not None:
            instance.mealType.set(meal_type_data)

        # Update 'images' if provided
        if images_data is not None:
            # Clear existing images
            instance.images.all().delete()
            # Create new images
            for image in images_data:
                RecipeContentImage.objects.create(recipe=instance, image=image)

        return instance


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email address is already in use.")
        return value


class PictureSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Picture
        fields = '__all__'
        depth = 1

class VideoSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Video
        fields = ['id', 'video', 'user', 'title']
        depth = 1

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.thumbnail:
            request = self.context.get('request')
            thumbnail_url = request.build_absolute_uri(instance.thumbnail.url)
            representation['thumbnail'] = thumbnail_url
        return representation

    def validate_video(self, value):
        ext = os.path.splitext(value.name)[1]
        valid_extensions = ['.mp4', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.webm']
        if not ext.lower() in valid_extensions:
            raise serializers.ValidationError('Unsupported file type. Please upload a video file.')
        return value
    
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class RecipeAlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeAlbum
        fields = '__all__'

class MediaAlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAlbum
        fields = '__all__'

class FamilyMemberNestedSerializer(serializers.ModelSerializer):
    picture_url = serializers.SerializerMethodField()
    class Meta:
        model = FamilyMember
        fields = ['id', 'name', 'birthday', 'deathday', 'bio', 'picture_url']

    def get_picture_url(self, obj):
        request = self.context.get('request')
        if request and hasattr(obj.picture, 'url'):
            return request.build_absolute_uri(obj.picture.url)
        return None


class FamilyMemberSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    spouse_detail = serializers.SerializerMethodField()
    parents = serializers.SerializerMethodField()
    picture_url = serializers.SerializerMethodField()

    class Meta:
        model = FamilyMember
        fields = ['id', 'name', 'birthday', 'deathday', 'bio', 'picture_url', 'father', 'mother', 'spouse', 'children', 'spouse_detail', 'parents']

    def get_children(self, instance):
        children = instance.children.all()
        return FamilyMemberNestedSerializer(children, many=True, context=self.context).data

    def get_spouse_detail(self, instance):
        if instance.spouse:
            return FamilyMemberNestedSerializer(instance.spouse, context=self.context).data
        return None

    def get_parents(self, instance):
        parents = [instance.father, instance.mother]
        return FamilyMemberNestedSerializer([parent for parent in parents if parent], many=True, context=self.context).data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Add string representation of related objects
        representation['father'] = instance.father.name if instance.father else None
        representation['mother'] = instance.mother.name if instance.mother else None
        representation['spouse'] = instance.spouse.name if instance.spouse else None
        return representation

    def get_picture_url(self, obj):
        request = self.context.get('request')
        if request and hasattr(obj.picture, 'url'):
            return request.build_absolute_uri(obj.picture.url)
        return None

class MealTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealType
        fields = '__all__'