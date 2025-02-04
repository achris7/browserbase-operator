from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import BrowserBaseSessions
from .serializers import BrowserBaseSessionsSerializer
from django.shortcuts import get_object_or_404


class BrowserBaseSessionsViewSet(viewsets.ModelViewSet):
    queryset = BrowserBaseSessions.objects.all()
    serializer_class = BrowserBaseSessionsSerializer

    def get_queryset(self):
        queryset = super().get_queryset().order_by('-created_at')
        browser_session_id = self.request.query_params.get('browser_session_id')
        email = self.request.query_params.get('email')

        if browser_session_id:
            queryset = queryset.filter(browser_session_id=browser_session_id)
        if email:
            queryset = queryset.filter(email=email)
        return queryset

    def get_object(self):
        """
        Retrieve an object using either `id` (default) or `browser_session_id`.
        """
        browser_session_id = self.kwargs.get('browser_session_id')
        if browser_session_id:
            return get_object_or_404(BrowserBaseSessions, browser_session_id=browser_session_id)
        return super().get_object()

    def update(self, request, *args, **kwargs):
        """
        Update session using `browser_session_id` instead of `id`.
        """
        browser_session_id = kwargs.get('browser_session_id')
        instance = get_object_or_404(BrowserBaseSessions, browser_session_id=browser_session_id)
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """
        Partially update session using `browser_session_id`.
        """
        browser_session_id = kwargs.get('browser_session_id')
        instance = get_object_or_404(BrowserBaseSessions, browser_session_id=browser_session_id)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Delete session using `browser_session_id`.
        """
        browser_session_id = kwargs.get('browser_session_id')
        instance = get_object_or_404(BrowserBaseSessions, browser_session_id=browser_session_id)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
