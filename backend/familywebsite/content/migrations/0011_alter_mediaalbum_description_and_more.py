# Generated by Django 5.0.6 on 2024-06-01 21:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0010_alter_familymember_spouse'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mediaalbum',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='recipealbum',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]