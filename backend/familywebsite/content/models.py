import os
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.dispatch import receiver
from django.db.models.signals import pre_save, pre_delete, post_save
import imageio


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

class Picture(models.Model):
    image = models.ImageField(upload_to='images/pictures/')
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='pictures')

    def delete(self, *args, **kwargs):
        # Delete the picture from the file system
        if self.image:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
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