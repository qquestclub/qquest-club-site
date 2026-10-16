from datetime import datetime, timezone as dt_timezone

from django.test import TestCase
from rest_framework.test import APIClient

from apps.events.models import Event
from apps.registrations.models import Registration

UTC = dt_timezone.utc
PUBLIC_EVENT_FIELDS = {
    "slug",
    "starts_at",
    "ends_at",
    "capacity",
    "registration_status",
    "registration_deadline",
    "seats_left",
}


def make_event(slug: str = "qff-2026", **overrides) -> Event:
    fields = {
        "slug": slug,
        "starts_at": datetime(2026, 11, 3, 4, 0, tzinfo=UTC),  # 09:30 IST
        "registration_status": Event.RegistrationStatus.OPEN,
        **overrides,
    }
    return Event.objects.create(**fields)


def make_registration(event: Event, email: str, status: str = "confirmed") -> Registration:
    return Registration.objects.create(
        event=event,
        name="Test Person",
        email=email,
        college="Test College",
        degree="B.Tech",
        branch="CS",
        year_of_study=2,
        status=status,
        consent_at=datetime(2026, 10, 1, tzinfo=UTC),
    )


class EventsApiTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()

    def test_G11_times_come_back_in_ist_with_an_explicit_offset(self) -> None:
        make_event()
        data = self.client.get("/api/events/qff-2026/").json()
        self.assertEqual(data["starts_at"], "2026-11-03T09:30:00+05:30")

    def test_G11_the_public_event_has_exactly_these_fields_and_no_personal_data(self) -> None:
        event = make_event()
        make_registration(event, "someone@example.com")
        data = self.client.get("/api/events/qff-2026/").json()
        self.assertEqual(set(data), PUBLIC_EVENT_FIELDS)
        self.assertNotIn("someone@example.com", str(data))

    def test_G13_seats_left_counts_only_confirmed_registrations(self) -> None:
        event = make_event(capacity=2)
        make_registration(event, "a@example.com", "confirmed")
        make_registration(event, "b@example.com", "waitlisted")
        make_registration(event, "c@example.com", "cancelled")
        self.assertEqual(self.client.get("/api/events/qff-2026/").json()["seats_left"], 1)

    def test_G13_seats_left_never_goes_below_zero_and_is_null_without_a_capacity(self) -> None:
        full = make_event("full-event", capacity=1)
        make_registration(full, "a@example.com")
        make_registration(full, "b@example.com")
        make_event("no-limit-event")
        self.assertEqual(self.client.get("/api/events/full-event/").json()["seats_left"], 0)
        self.assertIsNone(self.client.get("/api/events/no-limit-event/").json()["seats_left"])

    def test_G13_the_list_is_soonest_first(self) -> None:
        make_event("later", starts_at=datetime(2026, 12, 1, tzinfo=UTC))
        make_event("sooner", starts_at=datetime(2026, 11, 1, tzinfo=UTC))
        slugs = [item["slug"] for item in self.client.get("/api/events/").json()]
        self.assertEqual(slugs, ["sooner", "later"])

    def test_N11_draft_events_are_hidden_from_the_list_and_the_detail(self) -> None:
        make_event("secret", registration_status=Event.RegistrationStatus.DRAFT)
        self.assertEqual(self.client.get("/api/events/").json(), [])
        self.assertEqual(self.client.get("/api/events/secret/").status_code, 404)
