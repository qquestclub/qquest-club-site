from django.db.models import Count, Q
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Event
from .serializers import EventSerializer


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    """Public, read-only. Draft events stay hidden until an organizer opens them."""

    permission_classes = [AllowAny]
    serializer_class = EventSerializer
    lookup_field = "slug"
    pagination_class = None  # a club has a handful of events; revisit if that stops being true

    def get_queryset(self):
        return (
            Event.objects.exclude(registration_status=Event.RegistrationStatus.DRAFT)
            .annotate(confirmed_count=Count("registrations", filter=Q(registrations__status="confirmed")))
            .order_by("starts_at")
        )
