# architecture.md — QQuEST Club Website

## 1. Stack

| Layer | Choice | Version | Why |
|---|---|---|---|
| Language (site) | TypeScript, strict | ^5.9 | Catches content-shape mistakes before they reach a page |
| Framework (site) | Next.js App Router | ^16.0 | Static pages from Markdown; the team knows it from QFF (D-002) |
| UI | React with plain CSS | React ^19.2 | No UI framework to learn or migrate (D-014) |
| Content | Markdown and YAML front-matter | yaml ^2.8, marked ^18.0.10 | Portable and reviewable in Git (D-001) |
| Validation (site) | zod | ^3.25.76 | Bad content fails the build, not the visitor (D-015) |
| Tests (site) | node:test run by tsx | tsx ^4.20 | No test framework to install (D-016) |
| Site hosting | Vercel Hobby | — | Free, no card, first-class Next.js (D-008) |
| Backend | Django 5.2 LTS + Django REST Framework 3.16, Python 3.12 | see `backend/requirements.txt` | The team's choice (D-019, D-023) |
| Backend tests | Django's own test runner | — | Nothing extra to install |
| Database | Postgres on Neon free (SQLite locally) | — | D-020 |
| API hosting | Render free web service | — | D-021; sleeps after 15 minutes idle |
| Organizer auth | Django staff accounts | — | D-025; Clerk deferred |

Ranges are fixed by `package-lock.json` after task M0-REPO-01. Backend packages are ranged in `backend/requirements.txt` (the allowlist is in `backend/tests/test_invariants.py`).

## 2. Structure

```
qquest-club-site/
├── content/                 ← ALL editable content. One file per item, because merge conflicts in one big file are miserable
│   ├── digest/              ← issue-NNN-short-title.md
│   ├── events/              ← one file per event
│   ├── projects/            ← one file per project
│   ├── members/             ← one file per person; referenced by slug
│   └── pages/               ← about.md, join.md (free-form pages)
├── src/
│   ├── app/                 ← routes only. Pages read content and render; no business logic here
│   ├── components/          ← small shared server components (Header, Footer, cards)
│   └── lib/                 ← all logic. Pure functions where possible, so tests can run without Next
│       ├── content/         ← schemas, loader, markdown renderer, tag vocabulary
│       ├── dates.ts         ← the only place dates are formatted (INV-4)
│       ├── site-url.ts      ← the only place the site URL is decided (INV-5)
│       ├── rss.ts           ← RSS 2.0 builder
│       └── site.ts          ← name, tagline, contact, nav
├── backend/                 ← Django REST API (D-019, D-022). Runtime state only: capacity, registration, check-in
│   ├── config/              ← settings (the only place the environment is read), urls
│   ├── apps/core/           ← health routes and the standard error shape
│   ├── apps/events/         ← Event model (state only) and the public read-only API
│   ├── apps/registrations/  ← Registration and CheckIn models (staff-only for now)
│   └── tests/               ← Django tests; every test name carries its eval ID
├── render.yaml              ← Render blueprint for the API (UNVERIFIED until M0-BE-02)
├── tests/                   ← node:test files; every test name carries its eval ID
├── public/                  ← static files, images under public/images
├── spec/                    ← the spec system (requirements, plan, tasks, decisions...)
├── docs/                    ← CONTRIBUTING.md (for writers), HANDOVER.md (yearly checklist)
└── scripts/                 ← spec lint and the gate that runs tests; do not edit casually
```

Topology:

```
visitor ──► Vercel (Next.js, pre-built pages from content/)         always up, no backend needed
visitor ──► registration page ──(browser, after load)──► Render (Django API) ──► Neon (Postgres)
                                                          sleeps when idle; the page tolerates that
```

Content pages never call the API (INV-2). The only link between a Markdown event and its database row is the slug (D-024).

Rule: logic lives in `src/lib` and is tested; `src/app` stays thin. This is what lets the team change a page freely without risking an invariant.

## 3. Data model

### 3.1 v1 — content collections (built)

All validated by zod schemas in `src/lib/content/schema.ts`. Keys are snake_case and strict (unknown key = error).

| Collection | Required fields | Optional fields |
|---|---|---|
| digest | title, issue, date, authors, tags, summary, sources | cover, draft |
| events | title, starts_at, mode, location, summary | ends_at, registration_url, microsite_url, poster, draft |
| projects | title, summary, tags, status, year, team | repo_url, demo_url, writeup_url, cover, draft |
| members | name, role | batch, photo, bio, github, linkedin, active, draft |
| pages | title, description | cta_label, cta_url |

The Markdown body is the long text. Expensive to reverse: slugs (they become URLs) and the digest file naming.

### 3.2 Backend — runtime state (built, D-005, D-024)

Django models in `backend/apps/`. Content stays in Git; only state is stored.

```
Event         id, slug (unique), starts_at, ends_at (must be after starts_at), capacity (nullable),
              registration_status (draft | open | closed), registration_deadline (nullable), created_at
Registration  id (uuid), token (uuid4, unique, not the id), event (FK, PROTECT), name, email,
              college, degree, branch, year_of_study (1-8),
              status (confirmed | waitlisted | cancelled), consent_at (required), created_at
              UNIQUE (event, lower(email))                                    — INV-6
CheckIn       registration (one-to-one), checked_in_at, checked_in_by (staff username string),
              undone_at, undone_by (both set or both empty)                   — INV-7
```

Public API routes (INV-8, exactly these four): `GET /api/health/`, `GET /api/health/db/`, `GET /api/events/`, `GET /api/events/<slug>/`. Public event fields: slug, starts_at, ends_at, capacity, registration_status, registration_deadline, seats_left. Everything else is staff-only.

The full design, including diagrams, proposed tables, and the API map, is in [`docs/database/README.md`](../docs/database/README.md). Models in `backend/apps/` remain the source of truth for built behavior.

Planned, not built (M3): `POST` registration, check-in and undo, CSV export. Each needs a change proposal and an INV-8 list update.

## 4. Capability register

**Consult before building anything. Never build on an unsupported capability.**

| Capability | Status | Needed for |
|---|---|---|
| Pages pre-built from Markdown | supported | everything |
| Build fails on invalid content | supported | R-027 |
| Digest archive, issue pages, RSS, sitemap, robots | supported | digest |
| Pages that depend on the current time (events list, home) refresh hourly | supported | R-009 |
| IST event formatting | supported | R-012 |
| Tag filter pages | in progress (M1-DIG-01) | R-018 |
| Social preview and Instagram images | in progress (M1-DIG-02, M1-DIG-03) | R-020, R-021 |
| Structured data (JSON-LD) | in progress (M1-SEO-01) | R-039 |
| Site search | **not supported** | M2-SRCH-01 adds it |
| Add-to-calendar files | **not supported** | M2-EVT-01 adds it |
| Analytics | **not supported** | M2-OPS-01 adds it |
| Django API: health, standard errors, public event list and detail with `seats_left` | supported (tests pass; not yet deployed, M0-BE-02) | R-046 to R-049 |
| Deployed API on Render with Neon | **not supported** until M0-BE-02 passes | R-050 |
| Registration, waitlist, check-in, undo, CSV export | **not supported** | M3 (R-051 to R-056) |
| Registration form on the site | **not supported** | M3-REG-04 |
| Organizer sign-in beyond Django staff accounts | **not supported** | D-025, later |
| Sending email (QR codes, newsletter) | **not supported**; Render blocks SMTP so it must be an HTTP email API | M3-REG-05 |
| File or image uploads by visitors | **not supported** | later |
| Comments, attendee accounts, member-only content | **not supported** | later |

## 5. Scale assumptions
- Building for: a few hundred visitors a week, up to about 150 digest issues over 3 years, and events of up to a few hundred registrants (Neon free is 0.5 GB; a registration is under 1 KB).
- Revisit at: about 500 content files (build time) or 10,000 visitors a week (hosting limits).
- First thing to break: build time as content grows (fix with incremental regeneration), and the API's cold start on event day (warm it on page load; add a pinger during the event).
- Expensive to reverse: URL slugs and the digest file naming.

## 6. Performance budget
- Mobile Lighthouse performance and accessibility each at least 90 (R-035), measured on the deployed preview.
- Largest Contentful Paint under 2.5 s on a throttled 4G profile.
- No client-side components in v1, so content pages ship only the framework runtime.
- Images compressed below 300 KB each.

## 7. Security and privacy
- Stored about visitors: nothing on the content site. The API stores, per registrant, name, email, college, degree, branch, year and a consent timestamp.
- Public exposure: none of that is readable without a staff login (INV-8).
- Never logged: registration emails and QR tokens.
- Deletion: a registrant can be deleted on request, unless they have a check-in (INV-7), in which case the registration is anonymised instead; M3 defines the retention period.
- Secrets: only in the Render and Vercel dashboards. `.env.example` files list names, never values. Django refuses to start in production without `DJANGO_SECRET_KEY`.
- Transport: HTTPS redirect and secure cookies on in production; HSTS stays off until the domain is final.
- Abuse: anonymous requests are throttled (120/min); CORS allows only the site's origin.
- Content in `content/` is public. Member data follows the "never do this" rules in `CONTRACT.md`.

## 8. Architecture claims register

| Claim | Status | Evidence |
|---|---|---|
| v1 needs no database, login or secret | honored | `tests/invariants.test.ts` INV-2-T |
| Invalid content fails the build with the file and field named | honored | `tests/content.test.ts` N-01, N-02, N-03, N-06, N-07 |
| Event times render in IST regardless of the server timezone | honored | `tests/dates.test.ts` G-02 |
| A production build cannot emit a localhost URL | honored | `tests/site-url.test.ts` INV-5-T |
| Every published issue has at least one source | honored | `tests/content.test.ts` INV-3-T |
| An interactive layer sits beside the content without changing content files | honored in structure | the API only joins by slug (D-024); registration itself is M3 |
| Content pages work with the API switched off | honored for the website sources; deployed behaviour unproven | `tests/invariants.test.ts` INV-2-T; first real test is M0-BE-02 |
| Registrations are unique per event, ignoring email case | honored | `backend/tests/test_models.py` INV-6-T |
| A check-in can't be silently lost | honored | `backend/tests/test_models.py` INV-7-T |
| The public API exposes exactly four routes and no personal data | honored | `backend/tests/test_invariants.py` INV-8-T, `test_events_api.py` G-11 |
| The API runs free on Render and wakes acceptably | conceptual | D-021; checked in M0-BE-02 |
| Django ORM with Postgres works on Cloudflare Workers | conceptual | not verified; spike M3-SPIKE-01 |
