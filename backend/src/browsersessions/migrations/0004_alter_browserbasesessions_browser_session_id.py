# Generated by Django 5.1.5 on 2025-02-02 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('browsersessions', '0003_alter_browserbasesessions_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='browserbasesessions',
            name='browser_session_id',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
