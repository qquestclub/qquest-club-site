from django.db import DatabaseError, connection
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    """Is the web process up? Deliberately does NOT touch the database.

    The host calls this every few seconds. If it queried the database it would keep the
    free Neon database awake all month and use up its compute hours (spec D-021).
    """

    permission_classes = [AllowAny]
    throttle_classes: list = []

    def get(self, request: Request) -> Response:
        return Response({"status": "ok"})


class DatabaseHealthView(APIView):
    """Can the process reach the database? For humans to call, never for the host's checks."""

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
        except DatabaseError:
            return Response({"status": "degraded", "database": False}, status=503)
        return Response({"status": "ok", "database": True})
