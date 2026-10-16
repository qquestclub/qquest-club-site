"""Personal data lives here. Nothing in this app is ever returned by a public endpoint (INV-8)."""
import uuid

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Q
from django.db.models.functions import Lower
from django.utils import timezone


class Registration(models.Model):
    class Status(models.TextChoices):
        CONFIRMED = "confirmed", "Confirmed"
        WAITLISTED = "waitlisted", "Waitlisted"
        CANCELLED = "cancelled", "Cancelled"

    # A random UUID, not a counter, so ids cannot be guessed (INV-8).
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # What the QR code carries. Separate from `id` so it can be rotated if a code leaks.
    token = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey("events.Event", on_delete=models.PROTECT, related_name="registrations")
    name = models.CharField(max_length=120)
    email = models.EmailField()
    # One free-text field on purpose: a lookup table is more machinery than a club needs (D-005).
    college = models.CharField(max_length=160)
    degree = models.CharField(max_length=80, help_text="For example B.Tech, BCA, M.Sc.")
    branch = models.CharField(max_length=80, help_text="For example Computer Science.")
    year_of_study = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(8)])
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.CONFIRMED)
    # When the person agreed to the privacy notice. Required: it is never defaulted.
    consent_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        constraints = [
            # INV-6: one registration per person per event; "A@x.com" and "a@x.com" are the same person.
            models.UniqueConstraint(Lower("email"), "event", name="uniq_registration_event_email"),
        ]

    def __str__(self) -> str:
        return f"{self.name} <{self.email}> for {self.event.slug}"


class CheckIn(models.Model):
    """Attendance. One row per registration; undoing is recorded, never deleted (INV-7)."""

    registration = models.OneToOneField(Registration, on_delete=models.PROTECT, related_name="check_in")
    checked_in_at = models.DateTimeField(default=timezone.now)
    # A staff identifier: the Django username today, the Clerk user id once D-025 is built.
    checked_in_by = models.CharField(max_length=128)
    undone_at = models.DateTimeField(null=True, blank=True)
    undone_by = models.CharField(max_length=128, blank=True)

    class Meta:
        constraints = [
            # An undo must say who did it and when, or not exist at all.
            models.CheckConstraint(
                condition=(Q(undone_at__isnull=True) & Q(undone_by=""))
                | (Q(undone_at__isnull=False) & ~Q(undone_by="")),
                name="checkin_undo_has_actor_and_time",
            ),
        ]

    @property
    def is_active(self) -> bool:
        return self.undone_at is None

    def __str__(self) -> str:
        return f"{self.registration_id} ({'checked in' if self.is_active else 'undone'})"
