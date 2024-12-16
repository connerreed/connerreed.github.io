from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser

@receiver(post_save, sender=CustomUser)
def notify_admin_on_user_creation(sender, instance, created, **kwargs):
    if created:  # Trigger only when a new user is created
        subject = "Family Website - New User Registration"
        message = f"A new user has registered:\n\nIf this is an approved user, go to admin panel and approve them\n\nName: {instance.get_full_name()}\nEmail: {instance.email}\nDate Joined: {instance.date_joined}"
        admin_email = settings.ADMIN_EMAIL  # Set this in settings.py
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,  # Sender email
            [admin_email],  # Recipient email
        )
