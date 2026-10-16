from django.core.validators import RegexValidator
from django.db import models
from django.db.models import F, Q

SLUG_VALIDATOR = RegexValidator(
    r"^[a-z0-9]+(-[a-z0-9]+)*$",
    "Use lowercase letters, numbers and single hyphens, exactly like the Markdown file name.",
)


class Event(models.Model):
    """The RUNTIME side of an event: capacity, whether registration is open, deadlines.

    The event's title, description and poster live in the website's Markdown file
    content/events/<slug>.md (spec D-001, D-024). `slug` is the join key between the two,
    so it must match the file name exactly. There is deliberately no title here: a copy
    would drift out of date.
    """

    class RegistrationStatus(models.TextChoices):
        DRAFT = "draft", "Draft (hidden from the public API)"
        OPEN = "open", "Open"
        CLOSED = "closed", "Closed"

    slug = models.SlugField(max_length=64, unique=True, validators=[SLUG_VALIDATOR])
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField(null=True, blank=True)
    capacity = models.PositiveIntegerField(null=True, blank=True, help_text="Leave empty for no limit.")
    registration_status = models.CharField(
        max_length=10, choices=RegistrationStatus.choices, default=RegistrationStatus.DRAFT
    )
    registration_deadline = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-starts_at"]
        constraints = [
            models.CheckConstraint(
                condition=Q(ends_at__isnull=True) | Q(ends_at__gt=F("starts_at")),
                name="event_ends_after_start",
            ),
        ]

    def __str__(self) -> str:
        return self.slug
