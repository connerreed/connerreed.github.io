from django.contrib import admin
from .models import (Recipe, Picture, Video, Comment, Rating, RecipeAlbum, MediaAlbum, RecipeContentImage, MealType,
                     FamilyMember, CustomUser)
# Register your models here.
admin.site.register(Recipe)
admin.site.register(Picture)
admin.site.register(Video)
admin.site.register(Comment)
admin.site.register(Rating)
admin.site.register(RecipeAlbum)
admin.site.register(MediaAlbum)
admin.site.register(RecipeContentImage)
admin.site.register(MealType)
admin.site.register(FamilyMember)
admin.site.register(CustomUser)