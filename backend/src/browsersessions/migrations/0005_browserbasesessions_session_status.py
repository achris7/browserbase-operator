# Generated by Django 5.1.5 on 2025-02-02 16:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('browsersessions', '0004_alter_browserbasesessions_browser_session_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='browserbasesessions',
            name='session_status',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
