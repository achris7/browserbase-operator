from django.db import models


class BrowserBaseSessions(models.Model):
    email = models.EmailField(verbose_name="email", max_length=600)
    browser_session_id = models.CharField(max_length=200, null=True, blank=True)
    session_status = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateField(auto_now_add=True)
