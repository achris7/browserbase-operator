from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BrowserBaseSessionsViewSet

# DRF Router for standard CRUD operations
router = DefaultRouter()
router.register(r'browser-sessions', BrowserBaseSessionsViewSet, basename='browser-sessions')

urlpatterns = router.urls  # Includes default DRF routes

# Add custom routes for operations based on `browser_session_id`
urlpatterns += [
    path('browser-sessions/browser-session/<str:browser_session_id>/',
         BrowserBaseSessionsViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})),
]
