# evals.md — Evaluation

## 1. How to run

```
npm test              # website unit tests (about a second)
npm run test:backend  # Django API tests (needs: pip install -r backend/requirements.txt, DJANGO_DEBUG=1)
npm run verify        # spec lint, typecheck, website tests, backend tests, production build
```

Must pass before any deploy. Non-zero exit on failure. Website tests use `node:test` through `tsx`; backend tests use Django's runner. Each test name contains the ID of the eval row it checks (Python names cannot contain a hyphen, so `G-10` is written `G10`).

Tolerances: none. Every expected value below is exact.

## 2. Golden values

Literal expected values. Each ID appears in the name of the test that checks it.

| ID | Input | Expected |
|---|---|---|
| G-01 | `formatDate("2026-10-13")` | `13 Oct 2026` |
| G-02 | `formatEventDate("2026-11-03T09:30:00+05:30")` and `formatEventDate("2026-11-03T04:00:00Z")` | both `3 Nov 2026, 9:30 AM IST` |
| G-03 | `splitEvents` with one event at `2026-11-03T09:30:00+05:30` (no end time) and one at `2026-09-01T17:00:00+05:30` | at now `2026-10-13T12:00:00+05:30` the first is upcoming, the second past; at now `2026-11-03T12:00:00+05:30` the first is still upcoming; at now `2026-11-04T00:00:00+05:30` it is past |
| G-04 | `buildRss` for one fixture issue (see the test) | the exact XML string in `tests/rss.test.ts`, with `pubDate` `Tue, 13 Oct 2026 00:00:00 GMT` |
| G-05 | `getSiteUrl` with each environment case in CONTRACT "Reference examples" | `https://qquest.example`, `https://qquest.vercel.app`, and `http://localhost:3000` when nothing is set outside production |
| G-06 | The committed `content/` directory | loads with no errors and contains at least 1 member, 1 digest issue, 1 event, 1 project, and the pages `about` and `join` |
| G-10 | `GET /api/health/` and `GET /api/health/db/` | the first returns 200 `{"status":"ok"}` with zero database queries; the second returns 200 while the database answers |
| G-11 | `GET /api/events/<slug>/` for an event stored at `2026-11-03 04:00 UTC` | `starts_at` is `2026-11-03T09:30:00+05:30`, and the response has exactly these keys: slug, starts_at, ends_at, capacity, registration_status, registration_deadline, seats_left |
| G-12 | A new `Registration` | its `token` is a UUID version 4 and differs from its `id` |
| G-13 | `seats_left` for capacity 3 with 2 confirmed, 1 waitlisted and 1 cancelled registrations; and for capacity 1 with 2 confirmed | `2` (only confirmed count); and `0`, never negative; `null` when the event has no capacity; the list is soonest first |

## 3. Invariant tests

One per invariant in `CONTRACT.md`.

| ID | Invariant | Assertion |
|---|---|---|
| INV-1-T | Zero recurring cost | Every entry in `package.json` and in `backend/requirements.txt` is in the matching allowlist (`tests/invariants.test.ts`, `backend/tests/test_invariants.py`); an unlisted name fails the test |
| INV-2-T | Content pages work with the API off | No file under `src/` mentions `DATABASE_URL`, `@clerk`, `@neondatabase`, `prisma` or `drizzle`, and `process.env` appears only in `src/lib/env.ts` |
| INV-3-T | Sources required | The digest schema rejects an issue with an empty `sources` list, and every committed non-draft issue passes |
| INV-4-T | Offset required | The event schema rejects `2026-11-03T09:30:00` (no offset) and accepts `2026-11-03T09:30:00+05:30` |
| INV-5-T | No localhost in production | `getSiteUrl({ VERCEL_ENV: "production" })` throws; with `VERCEL_PROJECT_PRODUCTION_URL` set it returns an https URL |
| INV-6-T | One registration per person per event | The same email in a different letter case for the same event is rejected; the same person can register for a different event |
| INV-7-T | Check-in integrity | A second check-in for one registration is rejected; an undo without who and when is rejected; a recorded undo keeps the row; a registration with a check-in cannot be deleted |
| INV-8-T | No personal data on public endpoints | The set of routes is exactly the four in CONTRACT INV-8, and no registration or check-in route exists |

## 4. Negative tests

**More important than positive tests.** These catch regressions positive tests miss.

| ID | Assertion |
|---|---|
| N-01 | A digest issue whose author slug has no member file is rejected, and the error names the file and the slug |
| N-02 | A front-matter key the schema does not know (for example `start_at`) is rejected |
| N-03 | Two digest issues with the same `issue` number are rejected |
| N-04 | `buildRss` escapes `&`, `<`, `>` and quotes in titles and summaries; a title containing a script tag never appears raw in the output |
| N-05 | Draft items are excluded when drafts are not included, and present when they are |
| N-06 | A file name that is not lowercase kebab (for example `Bad Name.md`) is rejected, and a digest file whose number does not match its `issue` field is rejected |
| N-07 | An `http://` URL in `registration_url` or a source is rejected |
| N-08 | An unknown API event returns 404 with `code` NOT_FOUND; a POST to a read-only endpoint returns 405 METHOD_NOT_ALLOWED; a non-staff visitor on a route that is not explicitly public gets the standard error, not data |
| N-09 | A registration without a consent timestamp cannot be saved |
| N-11 | A draft event is absent from `/api/events/` and returns 404 on its detail route |
| N-12 | `/api/health/db/` returns 503 with `status: degraded` when the database is unreachable |

## 5. Telemetry
None in v1. Analytics arrive with M2-OPS-01 and need a decision entry first.

## 6. Pre-deploy gate
- [ ] `npm run verify` passes
- [ ] `smoke.md` passes (including the API section)
- [ ] No sample content reachable once M1 has closed
- [ ] Page source of the deployed home page contains no `localhost`

## 7. Recorded verdicts

Written after a milestone, not before. **PASS only where a test or a recorded live result backs it.** Never round up a PARTIAL.

No milestone verdicts recorded yet. M0 is the first.

Last known state (2026-10-16, not a milestone verdict): the 23 backend tests passed on Python 3.13 with SQLite in the build sandbox; the website's 49 pure-logic tests passed offline and the lib and tests type-check; `next build` and the Render deployment have **never** been run.
