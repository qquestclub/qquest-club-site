# QQuEST API (Django REST Framework)

The small backend behind the club website. In v1 it is only a skeleton: a health check, a
read-only events endpoint, and the data model for registrations and check-in. The website's
content pages never depend on it (see `CONTRACT.md` INV-2), so this can sleep or break without
taking the site down.

Why Django REST Framework, why Neon, why Render: `spec/decisions.md` D-019 to D-025.

## Run it locally

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

export DJANGO_DEBUG=1              # Windows PowerShell: $env:DJANGO_DEBUG="1"
python manage.py migrate           # creates a local SQLite file (never used in production)
python manage.py createsuperuser   # so you can open /admin/
python manage.py runserver
```

Open http://127.0.0.1:8000/api/health/ and http://127.0.0.1:8000/api/events/.

## Test it

```bash
python manage.py test              # about a second, no setup needed
```

Every test name starts with the ID of the row in `spec/evals.md` it checks.

## Layout

```
backend/
├── config/                 settings (the ONLY file that reads environment variables), urls
├── apps/
│   ├── core/               health endpoints and the one error shape for the whole API
│   ├── events/             Event: capacity, registration status, deadline (the runtime side of an event)
│   └── registrations/      Registration and CheckIn: personal data, never exposed publicly
└── tests/                  one file per area, tagged with eval IDs
```

## Rules you must not break

- **No personal data in any public endpoint** (INV-8). A new public route fails
  `tests/test_invariants.py` until you add it to the list on purpose.
- **Endpoints are staff-only by default.** A view must opt in to `AllowAny`.
- **Add a package** only with a `spec/decisions.md` entry, then add it to `requirements.txt`
  and to `ALLOWED_PACKAGES` in `tests/test_invariants.py` (INV-1).
- **Never commit secrets.** Everything comes from environment variables; see `.env.example`.
- **Change a model** → `python manage.py makemigrations`, commit the migration with it.

## Deploy

`render.yaml` at the repo root describes the Render service; the steps are task M0-BE-02 in
`spec/tasks.md`.
