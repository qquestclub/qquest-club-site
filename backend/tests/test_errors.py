from django.test import TestCase
from rest_framework.test import APIClient


class ErrorShapeTests(TestCase):
    """CONTRACT: every error is {"code": SCREAMING_SNAKE, "message": str}."""

    def setUp(self) -> None:
        self.client = APIClient()

    def test_N08_an_unknown_event_is_NOT_FOUND_in_the_standard_shape(self) -> None:
        response = self.client.get("/api/events/does-not-exist/")
        self.assertEqual(response.status_code, 404)
        body = response.json()
        self.assertEqual(body["code"], "NOT_FOUND")
        self.assertIsInstance(body["message"], str)
        self.assertEqual(set(body), {"code", "message"})

    def test_N08_writing_to_a_read_only_endpoint_is_METHOD_NOT_ALLOWED(self) -> None:
        response = self.client.post("/api/events/", {"slug": "x"}, format="json")
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()["code"], "METHOD_NOT_ALLOWED")

    def test_N08_a_non_staff_visitor_cannot_use_an_endpoint_that_is_not_explicitly_public(self) -> None:
        from rest_framework.views import APIView
        from rest_framework.response import Response
        from rest_framework.test import APIRequestFactory

        class Private(APIView):  # inherits the safe default permission (IsAdminUser)
            def get(self, request):
                return Response({"secret": True})

        request = APIRequestFactory().get("/private")
        response = Private.as_view()(request)
        self.assertIn(response.status_code, (401, 403))
        self.assertIn(response.data["code"], ("NOT_AUTHENTICATED", "PERMISSION_DENIED"))
        self.assertNotIn("secret", response.data)
