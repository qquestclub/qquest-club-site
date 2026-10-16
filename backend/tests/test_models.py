from datetime import datetime, timezone as dt_timezone

from django.db import IntegrityError, transaction
from django.test import TestCase

from apps.events.models import Event
from apps.registrations.models import CheckIn, Registration

UTC = dt_timezone.utc


def make_event(slug: str) -> Event:
    return Event.objects.create(slug=slug, starts_at=datetime(2026, 11, 3, 4, 0, tzinfo=UTC))


def make_registration(event: Event, email: str) -> Registration:
    return Registration.objects.create(
        event=event,
        name="Test Person",
        email=email,
        college="Test College",
        degree="B.Tech",
        branch="CS",
        year_of_study=2,
        consent_at=datetime(2026, 10, 1, tzinfo=UTC),
    )


class RegistrationRules(TestCase):
    def test_INV6T_the_same_email_in_a_different_case_cannot_register_twice_for_one_event(self) -> None:
        event = make_event("qff-2026")
        make_registration(event, "Person@Example.com")
        with self.assertRaises(IntegrityError), transaction.atomic():
            make_registration(event, "person@example.COM")

    def test_INV6T_the_same_person_can_register_for_two_different_events(self) -> None:
        make_registration(make_event("event-one"), "person@example.com")
        make_registration(make_event("event-two"), "person@example.com")
        self.assertEqual(Registration.objects.count(), 2)

    def test_G12_the_qr_token_is_a_random_uuid4_and_is_not_the_record_id(self) -> None:
        registration = make_registration(make_event("qff-2026"), "a@example.com")
        self.assertEqual(registration.token.version, 4)
        self.assertNotEqual(registration.token, registration.id)
        other = make_registration(make_event("other-event"), "b@example.com")
        self.assertNotEqual(registration.token, other.token)

    def test_N09_a_registration_without_consent_cannot_be_saved(self) -> None:
        with self.assertRaises(IntegrityError), transaction.atomic():
            Registration.objects.create(
                event=make_event("qff-2026"),
                name="No Consent",
                email="c@example.com",
                college="C",
                degree="B.Tech",
                branch="CS",
                year_of_study=1,
                consent_at=None,
            )


class CheckInRules(TestCase):
    def setUp(self) -> None:
        self.registration = make_registration(make_event("qff-2026"), "a@example.com")

    def test_INV7T_a_registration_can_only_be_checked_in_once(self) -> None:
        CheckIn.objects.create(registration=self.registration, checked_in_by="organizer-1")
        with self.assertRaises(IntegrityError), transaction.atomic():
            CheckIn.objects.create(registration=self.registration, checked_in_by="organizer-2")

    def test_INV7T_an_undo_must_record_who_did_it_and_when(self) -> None:
        check_in = CheckIn.objects.create(registration=self.registration, checked_in_by="organizer-1")
        check_in.undone_at = datetime(2026, 11, 3, 5, 0, tzinfo=UTC)  # no undone_by
        with self.assertRaises(IntegrityError), transaction.atomic():
            check_in.save()

    def test_INV7T_a_recorded_undo_keeps_the_row_and_the_history(self) -> None:
        check_in = CheckIn.objects.create(registration=self.registration, checked_in_by="organizer-1")
        check_in.undone_at = datetime(2026, 11, 3, 5, 0, tzinfo=UTC)
        check_in.undone_by = "organizer-2"
        check_in.save()
        check_in.refresh_from_db()
        self.assertFalse(check_in.is_active)
        self.assertEqual(check_in.checked_in_by, "organizer-1")
        self.assertEqual(CheckIn.objects.count(), 1)

    def test_INV7T_a_registration_with_a_check_in_cannot_be_deleted(self) -> None:
        from django.db.models import ProtectedError

        CheckIn.objects.create(registration=self.registration, checked_in_by="organizer-1")
        with self.assertRaises(ProtectedError):
            self.registration.delete()
