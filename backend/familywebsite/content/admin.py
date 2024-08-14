from django.contrib import admin
from .models import (
    Recipe, Picture, Video, Comment, Rating, RecipeAlbum, MediaAlbum,
    RecipeContentImage, MealType, FamilyMember, CustomUser
)
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

# Register your models
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

# Custom UserAdmin for CustomUser
class CustomUserAdmin(BaseUserAdmin):
    ordering = ['email']  # Update to use 'email' instead of 'username'
    list_display = ['email', 'first_name', 'last_name', 'is_staff']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'prefers_dark_mode')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                        'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login',)}),  # Removed 'date_joined'
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

    readonly_fields = ['last_login', 'date_joined']  # Add 'date_joined' here to make it read-only

    search_fields = ['email', 'first_name', 'last_name']

# Register the CustomUser model with the custom admin
admin.site.register(CustomUser, CustomUserAdmin)
