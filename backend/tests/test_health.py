from unittest import mock

from django.db import OperationalError
from django.test import TestCase
from rest_framework.test import APIClient


class HealthTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()

    def test_G10_health_answers_ok_without_touching_the_database(self) -> None:
        # Zero queries proves the host's frequent health checks cannot wake the database.
        with self.assertNumQueries(0):
            response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_G10_database_health_reports_ok_when_the_database_answers(self) -> None:
        response = self.client.get("/api/health/db/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "database": True})

    def test_N12_database_health_reports_503_when_the_database_is_down(self) -> None:
        with mock.patch("apps.core.views.connection.cursor", side_effect=OperationalError("down")):
            response = self.client.get("/api/health/db/")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json(), {"status": "degraded", "database": False})
