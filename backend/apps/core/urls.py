from django.urls import path

from .views import DatabaseHealthView, HealthView

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("health/db/", DatabaseHealthView.as_view(), name="health-db"),
]
