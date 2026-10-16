#!/usr/bin/env python
"""Django's command-line utility (run from the backend/ folder)."""
import os
import sys


def main() -> None:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    # `manage.py test` needs no setup. Nothing else gets debug mode implicitly:
    # production commands (migrate, gunicorn) must have DJANGO_SECRET_KEY set.
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        os.environ.setdefault("DJANGO_DEBUG", "1")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:  # pragma: no cover
        raise ImportError(
            "Django is not installed. From backend/: python -m venv .venv, activate it, "
            "then pip install -r requirements.txt"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
