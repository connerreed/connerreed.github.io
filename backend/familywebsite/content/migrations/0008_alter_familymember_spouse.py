# Generated by Django 5.0.6 on 2024-05-27 19:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0007_rename_birth_date_familymember_birthday_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='familymember',
            name='spouse',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='spouse_reverse', to='content.familymember'),
        ),
    ]