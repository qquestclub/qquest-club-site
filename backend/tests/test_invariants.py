import re
from pathlib import Path

from django.test import SimpleTestCase
from django.urls import get_resolver

BACKEND = Path(__file__).resolve().parent.parent

# INV-1: adding a package means adding it HERE with a spec/decisions.md entry in the same change.
ALLOWED_PACKAGES = {
    "django",
    "djangorestframework",
    "django-cors-headers",
    "dj-database-url",
    "psycopg",
    "gunicorn",
    "whitenoise",
}

# INV-8: every URL that can be called without being staff is listed here, on purpose.
# A new public route fails this test until someone adds it and thinks about what it exposes.
PUBLIC_API_ROUTES = {
    "api/health/",
    "api/health/db/",
    "api/events/",
    "api/events/<slug>/",
}


def api_routes() -> set[str]:
    routes: set[str] = set()

    def walk(patterns, prefix: str) -> None:
        for pattern in patterns:
            part = str(pattern.pattern)
            if hasattr(pattern, "url_patterns"):
                walk(pattern.url_patterns, prefix + part)
            else:
                routes.add(prefix + part)

    walk(get_resolver().url_patterns, "")
    return {re.sub(r"\(\?P<(\w+)>[^)]*\)", r"<\1>", r).replace("^", "").replace("$", "") for r in routes}


class InvariantTests(SimpleTestCase):
    def test_INV1T_every_requirement_is_on_the_approved_list(self) -> None:
        names = set()
        for line in (BACKEND / "requirements.txt").read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#"):
                names.add(re.match(r"[A-Za-z0-9_.-]+", line).group(0).lower())
        unlisted = names - ALLOWED_PACKAGES
        self.assertEqual(
            unlisted,
            set(),
            f"Not on the approved list: {sorted(unlisted)}. Add a spec/decisions.md entry, then add it to "
            "ALLOWED_PACKAGES in backend/tests/test_invariants.py.",
        )

    def test_INV8T_the_public_api_has_exactly_the_routes_we_decided_to_expose(self) -> None:
        routes = {route for route in api_routes() if route.startswith("api/")}
        self.assertEqual(routes, PUBLIC_API_ROUTES, f"Unexpected route set: {sorted(routes)}")

    def test_INV8T_no_registration_or_check_in_route_exists_in_the_public_api(self) -> None:
        for route in (r for r in api_routes() if r.startswith("api/")):
            self.assertNotIn("registration", route)
            self.assertNotIn("check-in", route)
            self.assertNotIn("checkin", route)
