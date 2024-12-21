import os
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.dispatch import receiver
from django.db.models.signals import pre_save, pre_delete, post_save
import imageio
from .validators import validate_unique_email


class CustomUserManager(BaseUserManager):
     def create_user(self, email, password=None, **extra_fields):
         if not email:
             raise ValueError('Users must have an email address')
         email = self.normalize_email(email)
         user = self.model(email=email, **extra_fields)
         user.set_password(password)
         user.save(using=self._db)
         return user
     
     def create_superuser(self, email, password=None, **extra_fields):
         extra_fields.setdefault('is_staff', True)
         extra_fields.setdefault('is_superuser', True)
         return self.create_user(email, password, **extra_fields)
     
class CustomUser(AbstractBaseUser, PermissionsMixin):
     email = models.EmailField(unique=True
                               #, validators=[validate_unique_email]
                               )
     first_name = models.CharField(max_length=30, blank=True)
     last_name = models.CharField(max_length=30, blank=True)
     is_active = models.BooleanField(default=True)
     is_staff = models.BooleanField(default=False)
     is_superuser = models.BooleanField(default=False)
     is_approved = models.BooleanField(default=False)
     date_joined = models.DateTimeField(auto_now_add=True)
     last_login = models.DateTimeField(auto_now=True)
     prefers_dark_mode = models.BooleanField(default=False)
 
     groups = models.ManyToManyField(
         'auth.Group',
         related_name='customuser_set',
         blank=True,
         help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
         verbose_name='groups',
     )
     user_permissions = models.ManyToManyField(
         'auth.Permission',
         related_name='customuser_set',
         blank=True,
         help_text='Specific permissions for this user.',
         verbose_name='user permissions',
     )
 
     objects = CustomUserManager()
 
     USERNAME_FIELD = 'email'
     REQUIRED_FIELDS = []

     def get_full_name(self):
            return f'{self.first_name} {self.last_name}'
     
     def get_short_name(self):
            return self.first_name
     
     def __str__(self):
         return self.get_full_name()
     

User = get_user_model()

class MealType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Recipe(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='recipes')
    recipeAuthor = models.CharField(max_length=100)
    mealType = models.ManyToManyField(MealType, related_name='recipes')
    featured = models.BooleanField(default=False)
    thumbnail = models.ImageField(upload_to='images/recipethumbnails/')

    def __str__(self):
        return f'{self.title} - {self.recipeAuthor}'


class RecipeContentImage(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='images/recipecontent/')

    def str(self):
        return self.recipe.title

from PIL import Image
#import subprocess
from wand.image import Image
from django.conf import settings
class Picture(models.Model):
    image = models.ImageField(upload_to='images/pictures/')
    thumbnail = models.ImageField(upload_to='images/picturethumbnails/', blank=True, null=True, max_length=500)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='pictures')
    date_uploaded = models.DateTimeField(auto_now_add=True)

    def generate_thumbnail(self):
        # Extract the filename from the image field's name
        picture_filename = os.path.basename(self.image.name)
        thumbnail_relative_path = os.path.join('images/picturethumbnails/', picture_filename)
        thumbnail_absolute_path = os.path.join(settings.MEDIA_ROOT, thumbnail_relative_path)

        # Ensure the thumbnail directory exists
        os.makedirs(os.path.dirname(thumbnail_absolute_path), exist_ok=True)

        # Input and Output Paths
        input_path = self.image.path

        # Verify input file exists
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input image does not exist at path: {input_path}")

        # Use Wand to create the thumbnail
        try:
            with Image(filename=input_path) as img:
                img.transform(resize='300x300')  # Resize to thumbnail dimensions
                img.auto_orient()  # Handle EXIF orientation
                img.save(filename=thumbnail_absolute_path)
        except Exception as e:
            raise RuntimeError(f"Failed to generate thumbnail: {e}")

        # Set the thumbnail path and save the model
        self.thumbnail = thumbnail_relative_path
        self.save(update_fields=['thumbnail'])

    def save(self, *args, **kwargs):
        # Perform the initial save to ensure the image is written to disk
        if not self.thumbnail:
            super().save(*args, **kwargs)  # Save initially to write the image file

            self.generate_thumbnail()
        else:
            super().save(*args, **kwargs)  # Save normally for other updates

    def delete(self, *args, **kwargs):
        # Delete the picture from the file system
        if self.image and os.path.isfile(self.image.path):
            os.remove(self.image.path)
        if self.thumbnail:
            thumbnail_path = os.path.join(settings.MEDIA_ROOT, self.thumbnail.name)
            if os.path.isfile(thumbnail_path):
                os.remove(thumbnail_path)
        super().delete(*args, **kwargs)


class Video(models.Model):
    video = models.FileField(upload_to='videos/')
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='videos')
    title = models.CharField(max_length=100, blank=True, null=True)
    thumbnail = models.ImageField(upload_to='images/videothumbnails/', blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.video and not self.thumbnail:
            self.generate_thumbnail()

    def generate_thumbnail(self):
        video_path = self.video.path
        thumbnail_path = os.path.join('media/images/videothumbnails/', f'{self.pk}.jpg')
        reader = imageio.get_reader(video_path)
        frame = reader.get_data(1)  # Get the second frame of the video
        imageio.imwrite(thumbnail_path, frame)
        self.thumbnail = thumbnail_path.replace('media/', '')
        self.save()

    def delete(self, *args, **kwargs):
        if self.video and os.path.isfile(self.video.path):
            os.remove(self.video.path)
        if self.thumbnail and os.path.isfile(self.thumbnail.path):
            os.remove(self.thumbnail.path)
        super().delete(*args, **kwargs)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return f'{self.user.username} - {self.content[:20]}'


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    score = models.IntegerField()
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return f'{self.user.username} - {self.score}'


class RecipeAlbum(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    private = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipe_albums')
    recipes = models.ManyToManyField(Recipe, related_name='albums')

    def __str__(self):
        return self.title


class MediaAlbum(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    private = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='media_albums')
    pictures = models.ManyToManyField(Picture, related_name='media_albums', blank=True)
    videos = models.ManyToManyField(Video, related_name='media_albums', blank=True)

    def __str__(self):
        return self.title

# Family Tree
class FamilyMember(models.Model):
    name = models.CharField(max_length=100)
    birthday = models.DateField()
    deathday = models.DateField(null=True, blank=True)
    bio = models.TextField(blank=True)
    picture = models.ImageField(upload_to='images/familytree/', null=True, blank=True)
    father = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='children_father', null=True, blank=True)
    mother = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='children_mother', null=True, blank=True)
    spouse = models.OneToOneField('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='spouse_reverse')

    def __str__(self):
        return self.name

    # Override the save method to ensure that the spouse relationship is mutual
    def save(self, *args, **kwargs):
        # Track if we are already in the process of saving to prevent infinite recursion
        if not hasattr(self, '_already_saving'):
            self._already_saving = False

        if not self._already_saving:
            self._already_saving = True
            try:
                super().save(*args, **kwargs)
            finally:
                self._already_saving = False
        else:
            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete the picture from the file system
        if self.picture:
            if os.path.isfile(self.picture.path):
                os.remove(self.picture.path)
        super().delete(*args, **kwargs)

    @property
    def children(self):
        return FamilyMember.objects.filter(models.Q(father=self) | models.Q(mother=self))

    @property
    def siblings(self):
        return FamilyMember.objects.filter(
            models.Q(father=self.father) | models.Q(mother=self.mother)
        ).exclude(id=self.id)

    @property
    def parents(self):
        parents = []
        if self.father:
            parents.append(self.father)
        if self.mother:
            parents.append(self.mother)
        return parents
    
@receiver(post_save, sender=FamilyMember)
def set_spouse_relationship(sender, instance, **kwargs):
    if instance.spouse and instance.spouse.spouse != instance:
        instance.spouse.spouse = instance
        instance.spouse.save()
    
@receiver(pre_save, sender=FamilyMember)
def delete_old_picture(sender, instance, **kwargs):
    if not instance.pk:
        return False
    
    try:
        old_picture = FamilyMember.objects.get(pk=instance.pk).picture
    except FamilyMember.DoesNotExist:
        return False
    
    new_picture = instance.picture
    if old_picture and old_picture != new_picture:
        if os.path.isfile(old_picture.path):
            os.remove(old_picture.path)

@receiver(pre_delete, sender=FamilyMember)
def delete_picture_on_delete(sender, instance, **kwargs):
    if instance.picture:
        if os.path.isfile(instance.picture.path):
            os.remove(instance.picture.path)