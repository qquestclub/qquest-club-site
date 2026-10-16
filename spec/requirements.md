# requirements.md — What the site must do

*The short version, for people who just want to know what we are building. Every line has an ID (`R-nnn`) so tasks, tests and commits can point at it. The reasoning behind each choice lives in `decisions.md`, not here.*

**How to read the Phase column:** M0 = backend skeleton. M1 = launch (v1). M2 = polish. M3 = event management (registration and check-in). Later = decided but not scheduled (see `plan.md`).

---

## 1. In one paragraph

QQuEST is a quantum computing club. This website is its permanent home: who we are, what we run, what we have built, and a weekly digest of what happened in quantum. It must cost nothing to run, survive every batch of members graduating, and let a non-developer publish by editing a Markdown file. Event microsites (like Qiskit Fall Fest 2026) stay separate and are linked from here.

## 2. Who uses it

| Visitor | Wants |
|---|---|
| Prospective member | What is this club, is it for me, how do I join |
| Student from another college | Events to attend, the digest |
| Current member | A place to publish and get credit |
| Faculty, IBM/Qiskit community, sponsors | Proof that the club is active and credible |

## 3. Requirements

Format: the EARS patterns from `orchestration` — THE system SHALL (always), WHEN (event), IF/THEN (unwanted), WHILE (state), WHERE (option). Each row names the task that delivers it.

### 3.1 Site and identity

| ID | Requirement | Phase | Task |
|---|---|---|---|
| R-001 | THE site SHALL pre-build its pages from Markdown files in `content/`. | M1 | M0-CONT-01 |
| R-002 | THE site SHALL be usable at 360 px width with no horizontal scroll. | M1 | M0-PAGE-01 |
| R-003 | THE header SHALL link to Home, Digest, Events, Projects, Team, About and Join on every page. | M1 | M0-PAGE-01 |
| R-004 | IF a URL does not exist THEN THE site SHALL show a 404 page with a link home. | M1 | M0-PAGE-01 |
| R-005 | THE Home page SHALL show the tagline, a club description, the latest 3 digest issues, the next upcoming event (if any), up to 3 projects and a Join call-to-action. | M1 | M1-HOME-01 |
| R-006 | THE About page SHALL explain what QQuEST is and what "kyu QQuEST" means. | M1 | M1-ABT-01 |
| R-007 | THE Team page SHALL list members with name and role, active members first, alumni in a separate group. | M1 | M1-TEAM-01 |
| R-008 | THE Join page SHALL explain how to join and link to the sign-up form. | M1 | M1-JOIN-01 |

### 3.2 Events

| ID | Requirement | Phase | Task |
|---|---|---|---|
| R-009 | THE Events page SHALL list upcoming events (soonest first) apart from past events (latest first). | M1 | M0-PAGE-01 |
| R-010 | WHERE an event has a registration link THE event page SHALL show a Register button pointing to it. | M1 | M0-PAGE-01 |
| R-011 | WHERE an event has its own microsite THE event page SHALL link to it. | M1 | M0-PAGE-01 |
| R-012 | THE site SHALL show every event time in IST with the label "IST". | M1 | M0-CONT-02 |
| R-013 | IF an event has no end time THEN THE site SHALL treat it as upcoming until the end of its calendar day in IST. | M1 | M0-CONT-02 |
| R-014 | THE site SHALL contain at least 3 real events (past or upcoming) at launch. | M1 | M1-EVT-01 |

### 3.3 Weekly digest

| ID | Requirement | Phase | Task |
|---|---|---|---|
| R-015 | THE Digest archive SHALL list published issues newest first, with issue number, date, summary and tags. | M1 | M0-PAGE-01 |
| R-016 | THE issue page SHALL show title, issue number, date, authors, tags, body and a Sources list. | M1 | M0-PAGE-01 |
| R-017 | IF an issue has no source link THEN THE build SHALL fail. | M1 | M0-CONT-01 |
| R-018 | WHEN a visitor opens a tag page THE site SHALL list only issues carrying that tag. | M1 | M1-DIG-01 |
| R-019 | THE site SHALL publish an RSS feed at `/feed.xml` with the latest 20 published issues. | M1 | M0-CONT-02 |
| R-020 | WHEN an issue link is shared THE site SHALL provide a 1200 x 630 preview image for it. | M1 | M1-DIG-02 |
| R-021 | THE site SHALL provide a 1080 x 1350 image per issue for Instagram posts. | M1 | M1-DIG-03 |
| R-022 | THE site SHALL contain at least 3 real digest issues at launch. | M1 | M1-DIG-04 |

### 3.4 Projects and team

| ID | Requirement | Phase | Task |
|---|---|---|---|
| R-023 | THE Projects page SHALL show a card per project with title, summary, tags and status. | M1 | M0-PAGE-01 |
| R-024 | THE project page SHALL list its team (linked to Team) and its repo, demo and write-up links when present. | M1 | M0-PAGE-01 |
| R-025 | THE site SHALL contain at least 3 real projects at launch. | M1 | M1-PRJ-01 |

### 3.5 Content rules (so the site cannot quietly rot)

| ID | Requirement | Phase | Task |
|---|---|---|---|
| R-026 | WHEN a Markdown file is added to a `content/` folder THE site SHALL gain the matching page with no code change. | M1 | M0-CONT-01 |
| R-027 | IF a content file has a missing, unknown or wrongly typed field THEN THE build SHALL fail and name the file and field. | M1 | M0-CONT-01 |
| R-028 | IF a digest author or project team member does not exist THEN THE build SHALL fail. | M1 | M0-CONT-01 |
| R-029 | WHILE running in production THE site SHALL hide content marked `draft: true`. | M1 | M0-CONT-01 |
| R-030 | IF an event time has no UTC offset THEN THE build SHALL fail. | M1 | M0-CONT-01 |

### 3.6 Platform, quality and ownership

| ID | Requirement | Phase | Task |
|---|---|---|---|
| R-031 | THE site SHALL run entirely on free plans. | M1 | M0-DEP-01 |
| R-032 | THE content pages SHALL build and render with no database, no login, no secret keys and the API switched off. | M1 | M0-CONT-01 |
| R-033 | IF the production URL cannot be determined THEN a production build SHALL fail instead of emitting localhost links. | M1 | M0-CONT-02 |
| R-034 | THE site SHALL provide `sitemap.xml` and `robots.txt`. | M1 | M0-PAGE-01 |
| R-035 | THE site SHALL score at least 90 on mobile Lighthouse for performance and for accessibility. | M1 | M1-PERF-01 |
| R-036 | THE site SHALL support keyboard navigation, visible focus, image alt text, sufficient contrast and reduced-motion. | M1 | M1-A11Y-01 |
| R-037 | THE repo SHALL contain a contributor guide that a non-developer can follow to publish an issue through the GitHub website. | M1 | M1-DOC-01 |
| R-038 | THE GitHub org, hosting and domain SHALL be club-owned, with at least 2 named admins and a yearly handover checklist. | M1 | M0-OWN-01 |
| R-039 | THE site SHALL carry event and article structured data for search engines. | M1 | M1-SEO-01 |

### 3.7 Polish (M2)

| ID | Requirement | Phase | Task |
|---|---|---|---|
| R-040 | WHEN a visitor types in the search box THE site SHALL list matching digest issues, events and projects. | M2 | M2-SRCH-01 |
| R-041 | WHERE an event is upcoming THE event page SHALL offer an add-to-calendar file. | M2 | M2-EVT-01 |
| R-042 | WHERE an event is past THE event page SHALL be able to show a recap with photos and slides. | M2 | M2-EVT-02 |
| R-043 | THE site SHALL record privacy-friendly page-view analytics. | M2 | M2-OPS-01 |
| R-044 | THE site SHALL offer a Resources page of beginner learning paths. | M2 | M2-RES-01 |
| R-045 | THE site SHALL offer an achievements timeline. | M2 | M2-ACH-01 |

### 3.8 Backend and event management

The backend is a Django REST Framework API (D-019). The skeleton exists from M0; registration and check-in are M3.

| ID | Requirement | Phase | Task |
|---|---|---|---|
| R-046 | THE API SHALL answer `/api/health/` without touching the database, so a host health check never wakes the database. | M0 | M0-BE-01 |
| R-047 | THE API SHALL answer `/api/health/db/` with 503 when the database is unreachable. | M0 | M0-BE-01 |
| R-048 | THE API SHALL return every error as `{code, message, details?}`. | M0 | M0-BE-01 |
| R-049 | THE API SHALL list public events, soonest first, with `seats_left` and without drafts or personal data. | M0 | M0-BE-01 |
| R-050 | THE API SHALL be deployed on a free host and answer `/api/health/` from the internet. | M0 | M0-BE-02 |
| R-051 | WHEN a person submits the registration form with consent THE API SHALL store one registration and return a confirmed or waitlisted status. | M3 | M3-REG-01 |
| R-052 | IF the same email (any letter case) registers twice for one event THEN THE API SHALL reject the second. | M3 | M3-REG-01 |
| R-053 | WHEN registration is closed, past its deadline or the event is a draft THE API SHALL refuse a new registration. | M3 | M3-REG-01 |
| R-054 | WHEN an organizer scans a registration's QR token THE API SHALL record a check-in once, and show who and when. | M3 | M3-REG-02 |
| R-055 | WHEN an organizer undoes a check-in THE API SHALL keep the record and note who undid it. | M3 | M3-REG-02 |
| R-056 | THE organizer SHALL be able to see registrations and export them as CSV. | M3 | M3-REG-03 |
| R-057 | THE event page SHALL show a registration form that wakes the API on load and shows a clear message when the API is slow or down. | M3 | M3-REG-04 |
| R-058 | WHEN a registration is confirmed THE system SHALL email the attendee a QR code through an HTTP email API. | M3 | M3-REG-05 |

### 3.9 Later (decided, not scheduled)

Recorded so they are not forgotten and so v1 does not block them. Each starts only when its trigger in `plan.md` fires.

| ID | Requirement | Phase |
|---|---|---|
| R-F01 | Readers subscribe to the digest by email with double opt-in. | Later |
| R-F02 | Members have profiles; attendance can produce certificates. | Later |
| R-F03 | Organizers sign in with Google through Clerk or django-allauth. | Later (D-025) |

## 4. Not doing (for now)

- **No attendee accounts, ever (for now).** Attendees register with a form and get a QR token (D-007). Organizers use Django's staff login (D-025).
- **No content in the database.** Digest, events, projects and members stay in Git (D-001). The database holds registrations and check-ins only.
- **No paid services.** A service that needs a payment method needs a recorded decision first.
- **No replacing event microsites.** They have different lifetimes and deadlines.
- **No email newsletter in v1.** The digest is a blog first; Instagram and LinkedIn carry it to people.

## 5. Decisions the team still owes

| Question | Needed by | Owner |
|---|---|---|
| What does "kyu QQuEST" mean to the club? Final tagline? | M1-BRAND-01 | Website lead |
| Digest name and publishing day | M1-BRAND-01 | Digest editor |
| Who are the website lead, digest editor, events lead, and their backups? | M0-OWN-01 | Club leads |
| Domain: club-owned or a university subdomain? | M1-DEP-02 | Club leads |
| Does the college or faculty back a payment method if a later phase needs one? | Before any v2 work | Club leads |
| Does Vercel Hobby allow this club's use from the org repo? | M0-DEP-01 | Website lead |
| Does the team want Django's admin to manage events or blog posts? That would reverse D-001 (content in Git) and needs a change proposal | Before M3 | Website lead |
| Which free HTTP email service sends QR emails (Render blocks SMTP)? | M3-REG-05 | Events lead |
| Does the Render free cold start (about a minute) suit the registration flow, or do we want an event-week pinger? | M0-BE-02 | Website lead |
