from rest_framework import serializers
from .models import BrowserBaseSessions


class BrowserBaseSessionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrowserBaseSessions
        fields = ['browser_session_id', 'email', 'created_at', 'session_status']
