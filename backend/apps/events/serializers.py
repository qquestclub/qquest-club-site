from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    """The PUBLIC view of an event. Never add personal data here (CONTRACT INV-8)."""

    seats_left = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "slug",
            "starts_at",
            "ends_at",
            "capacity",
            "registration_status",
            "registration_deadline",
            "seats_left",
        ]
        read_only_fields = fields

    def get_seats_left(self, event: Event) -> int | None:
        if event.capacity is None:
            return None
        # `confirmed_count` is added by the view's queryset (one query for the whole list).
        return max(event.capacity - event.confirmed_count, 0)
