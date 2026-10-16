# CONTRACT — QQuEST Club Website

**The correctness core. An agent that reads only this file must not be able to break the project.**

Precedence: this file outranks every other document. If something here conflicts with a task, the task is wrong — stop and flag it.

---

## Invariants

### INV-1 — Zero recurring cost

**Rule:** Every runtime or build dependency is on the approved list (`tests/invariants.test.ts` for the website, `backend/tests/test_invariants.py` for the API), and nothing needs a paid plan or a payment method.
**Why:** The club has no budget. A dependency or service that quietly needs a card is the one that kills the site after a graduation.
**Violated by:** Adding a package or a hosted service because it is convenient, without a decision.
**Detected by:** INV-1-T — the dependency allowlist tests fail when `package.json` or `backend/requirements.txt` contains anything unlisted. Adding to the list requires a `decisions.md` entry in the same change.

### INV-2 — Content pages work with the API off

**Rule:** Nothing under `src/` may import a database client or auth SDK, read a secret, or call the Django API while building or rendering a content page (home, digest, events list and detail, projects, team, about, join, feed). The site builds and runs with an empty environment. Only a registration page may call the API, and only from the browser, after the page has loaded.
**Why:** The API sleeps on a free host and its database can pause or hit limits. Content pages are the club's public face and must survive all of that, and a rotating team cannot babysit more than it must (D-021).
**Violated by:** Fetching `/api/events/` inside a server component to show seats on the events page, importing a database client in `src/`, or reading a secret in a page.
**Detected by:** INV-2-T — scans `src/` for backend references and for `process.env` outside `src/lib/env.ts`.

### INV-3 — Every published digest issue cites its sources

**Rule:** A digest issue that is not a draft has at least one source with a title and an https URL.
**Why:** Quantum news is full of hype. Sourced claims are the digest's only credibility.
**Violated by:** Publishing a summary written from memory or from a headline.
**Detected by:** INV-3-T — the digest schema rejects an issue with zero sources, and the committed issues are loaded in the same test.

### INV-4 — Event times carry an explicit UTC offset and display in IST

**Rule:** Every event `starts_at` and `ends_at` is an ISO 8601 timestamp with an explicit offset (for example `+05:30`). Display always uses the `Asia/Kolkata` zone and the label `IST`, whatever timezone the build machine or the visitor uses.
**Why:** A bare `2026-11-03T09:30:00` is read in the server's timezone. On a UTC build server the event would show 5.5 hours early.
**Violated by:** Writing a time without an offset, or formatting dates with the machine's local zone.
**Detected by:** INV-4-T — a time without an offset is rejected; G-02 pins the exact rendered string.

### INV-5 — No localhost URL in production

**Rule:** The site URL comes only from `getSiteUrl()` in `src/lib/site-url.ts`. In a production deployment with no configured URL, the build fails.
**Why:** The QFF 2026 site shipped canonical and social-preview URLs pointing at `http://localhost:3000`, which breaks search results and share previews.
**Violated by:** Hard-coding a domain or reading `process.env` for the URL anywhere else.
**Detected by:** INV-5-T — production without a URL throws; G-05 pins the resolution order.

### INV-6 — One registration per person per event

**Rule:** The database rejects a second registration for the same event whose email matches the first ignoring case. The same person may register for different events.
**Why:** Duplicates eat capacity, break waitlist order and make the door count wrong. Doing it in a database constraint, not only in code, means no code path can forget it.
**Violated by:** Checking for duplicates in a view only, or comparing emails case-sensitively.
**Detected by:** INV-6-T — `backend/tests/test_models.py`, same email in different case is rejected.

### INV-7 — Check-in integrity

**Rule:** A registration has at most one check-in. An undo keeps the row and records who undid it and when (both or neither). A registration that has a check-in cannot be deleted.
**Why:** The door log is the audit trail. Deleting or overwriting it hides mistakes and disputes.
**Violated by:** Deleting a `CheckIn` row to "undo", or cascading a registration delete through to its check-in.
**Detected by:** INV-7-T — four tests in `backend/tests/test_models.py`.

### INV-8 — No personal data on public endpoints

**Rule:** The only routes callable without a staff account are exactly `api/health/`, `api/health/db/`, `api/events/` and `api/events/<slug>/`. The public event shape carries no name, email or any registration detail. Everything else defaults to staff-only.
**Why:** Registrants are students; their details must not leak because someone added a route and forgot a permission. The test makes a new public route a deliberate act.
**Violated by:** Adding a viewset without checking its permission, or adding a field to the public event serializer that reveals who registered.
**Detected by:** INV-8-T — the route list test and the field-list test (G-11).

---

## Pinned conventions

Each could reasonably go two ways. Each is pinned. Divergence is a bug, not a style preference.

| Concern | Decision |
|---|---|
| Timezone | Stored with an explicit offset; displayed in `Asia/Kolkata` as `IST`. Example: `2026-11-03T09:30:00+05:30` renders `3 Nov 2026, 9:30 AM IST` |
| Date-only fields | `YYYY-MM-DD`, shown as `13 Oct 2026`. Digest and member dates only |
| YAML values | Dates and times are plain strings. The loader uses the YAML core schema, so a date is never turned into a Date object |
| Slugs | File name without `.md`, lowercase kebab: pattern `^[a-z0-9]+(-[a-z0-9]+)*$`. Example `qff-2026` |
| Digest file name | `issue-NNN-short-title.md`, NNN zero-padded to 3 digits and equal to the `issue` field. Example `issue-007-error-correction-basics.md` |
| Digest tags | A fixed vocabulary in `src/lib/content/tags.ts`: hardware, algorithms, error-correction, industry, india, policy, education, research |
| Front-matter keys | snake_case (`starts_at`), strict: an unknown key is an error, which catches typos |
| People references | By member slug: `authors: [sample-member]` |
| URLs in content | Absolute `https://` only |
| Source file names | kebab-case for `.ts` files, PascalCase for React components |
| Images | In `public/images/`, referenced as `/images/name.ext`, compressed below 300 KB before committing (reviewer checks) |
| Drafts | `draft: true` hides an item in production and shows it in development |
| Upcoming event | Upcoming until its `ends_at`; with no `ends_at`, until 23:59:59.999 IST on its start day |
| Content errors | Fail the build with a message naming the file and field. Never skip a bad file silently |
| API base path | Every backend route starts with `/api/` and ends with `/` |
| API errors | Always `{"code": "...", "message": "...", "details": ...}`; `details` only when useful. Codes: VALIDATION_ERROR, NOT_AUTHENTICATED, PERMISSION_DENIED, NOT_FOUND, METHOD_NOT_ALLOWED, UNSUPPORTED_MEDIA_TYPE, THROTTLED, ERROR |
| API timestamps | ISO 8601 with `+05:30`, from Django's `Asia/Kolkata` setting |
| API identifiers | Events by slug (the Markdown file name without `.md`); registrations by UUID; the QR token is a separate random UUID4 and never the record id |
| API permissions | Default is staff-only (`IsAdminUser`). A route is public only by being written in the INV-8 list |
| Backend config | Only `backend/config/settings.py` reads the environment; the secret key is required unless `DJANGO_DEBUG=1` |
| Python files | snake_case; tests in `backend/tests/` with the eval ID in the test name |

---

## Exact values

```
DISPLAY_TIMEZONE   = "Asia/Kolkata"      (UTC+05:30, no daylight saving)
DISPLAY_TZ_LABEL   = "IST"
REVALIDATE_SECONDS = 3600                (pages that depend on "now")
RSS_ITEM_LIMIT     = 20
LOCAL_SITE_URL     = "http://localhost:3000"   (development only)
```

---

## Reference examples

| Input | Expected output |
|---|---|
| `formatDate("2026-10-13")` | `13 Oct 2026` |
| `formatEventDate("2026-11-03T09:30:00+05:30")` | `3 Nov 2026, 9:30 AM IST` |
| `formatEventDate("2026-11-03T04:00:00Z")` | `3 Nov 2026, 9:30 AM IST` |
| Event with no `ends_at`, start `2026-11-03T09:30:00+05:30`, now `2026-11-03T12:00:00+05:30` | upcoming |
| Same event, now `2026-11-04T00:00:00+05:30` | past |
| `getSiteUrl` with `NEXT_PUBLIC_SITE_URL=https://qquest.example` | `https://qquest.example` |
| `getSiteUrl` with `VERCEL_PROJECT_PRODUCTION_URL=qquest.vercel.app` | `https://qquest.vercel.app` |
| `getSiteUrl` with `VERCEL_ENV=production` and no URL variables | throws |

---

## Never do this

- **Never commit a secret** (`.env`, keys, tokens) — a key committed once is compromised even after deletion. Use the host's environment variables.
- **Never write an event time without an offset** — it silently shifts by the server's timezone. Write `+05:30`.
- **Never hard-code a domain or `localhost`** — use `getSiteUrl()`. See INV-5.
- **Never add a dependency without the allowlist and a decision** — see INV-1.
- **Never pass user-submitted text through `renderMarkdown`** — it does not sanitize, because v1 content is reviewed in pull requests. Untrusted input needs a sanitizer first.
- **Never put a member's phone number, personal email or photo in `content/` without their consent** — the repo and site are public. Use the club's role mailbox and links they chose.
- **Never publish a digest claim you cannot source** — the digest's credibility is the product. Cut the claim, or cut the issue.
- **Never expose a registrant's name, email or token on a public route** — see INV-8. Add the route to the test list on purpose, or keep it staff-only.
- **Never delete a check-in or a registration that has one** — undo it with the undo fields. See INV-7.
- **Never store a password or card number** — attendees have no accounts (D-007); organizers use Django's built-in auth.
- **Never put a real secret in `backend/.env.example`** — names only, never values.
- **Never call the API from a content page's server render** — see INV-2.
- **Never fake a capability** — no newsletter box, registration form or "coming soon" button that does nothing. Link to the real external form or leave it out.
- **Never skip a failing content file to make a build pass** — fix the file. A build that tolerates bad content is how a page quietly goes missing.

---

## Changing this file

Requires explicit human approval. An agent proposing a change here stops and asks; it does not edit and report.
