from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model


def validate_unique_email(value):
    User = get_user_model()
    if User.objects.filter(email=value).exists():
        raise ValidationError(_('User with this email already exists'), code='unique')