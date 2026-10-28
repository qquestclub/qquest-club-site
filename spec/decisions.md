# decisions.md — Decision Log

Every non-obvious decision, why, and what was rejected. **This file exists to stop the next agent from re-opening a settled question or reverting a deliberate choice.**

Vendor facts below were checked in October 2026 and free tiers change often. Re-check them every semester (see `docs/HANDOVER.md`) before relying on them.

---

## D-001 — Content lives in Git as Markdown files

**Status:** decided
**Decision:** Digest issues, events, projects, members and free-form pages are Markdown files with YAML front-matter under `content/`. Publishing is a pull request.
**Rationale:** It is free forever and owned by the club, not a vendor. Pull requests give a built-in editorial workflow: a second member fact-checks every issue before it goes live, which matters for a quantum digest where overclaiming hurts credibility. Git history credits authors and keeps every version. The same pattern runs many technical documentation sites, including IBM Quantum's, so members meet it again in industry. Content stays portable if we change framework or add a database.
**Rejected:**
- *Everything in a database* — loses review and history, forces us to build an editor and admin UI, and the content disappears if the free tier lapses.
- *A hosted CMS* — vendor lock-in and a single account that can be lost.
**Revisit if:** non-technical writers keep struggling with Git. The answer is then a Git-backed editor on top (see D-017 and the Community row in `plan.md`), not abandoning Markdown.

---

## D-002 — Static-first pages; the server only where state is needed

**Status:** decided
**Decision:** Pages that are the same for everyone are pre-built. Only features that must remember something (registrations, check-ins, accounts) run server-side, in the Django API (D-019), and only from M3.
**Rationale:** Pre-built pages are the fastest, cheapest and most resilient: they stay up when a database or free tier fails. Most of the site never needs a server. Adding interactivity later sits beside the content rather than replacing it.
**Rejected:**
- *Fully static export* — cannot do registration or check-in, which the club wants later.
- *Fully dynamic rendering* — slower, costlier, and breaks entirely when the backend sleeps.
**Revisit if:** build time becomes painful. Switch to incremental regeneration before changing architecture.

---

## D-003 — One Next.js codebase; no separate Django backend for now

**Status:** superseded by D-019 (the team chose Django REST Framework on 2026-10-15). Kept so the reasoning is not lost: its warnings about a sleeping free host and a second codebase are now handled by INV-2 and D-021.
**Decision (original):** Next.js serves the pages and, in phase 2, the small interactive API (registration, check-in) through its own server routes. A separate Django REST Framework service, suggested by a teammate, is not used.
**Rationale:** A rotating student team cannot realistically maintain two codebases and two hosts. Free hosting for an always-needed API is the weak link: Render's free tier sleeps after 15 minutes and takes about a minute to wake, Fly.io no longer has a free tier, and Koyeb added a card requirement. Registration and check-in are small, bounded features that do not need a full backend framework. The team already knows Next.js from QFF.
**Rejected:**
- *Django REST Framework plus Next.js* — a strong stack and Django's admin panel is a real loss, but it needs a second host with no good free option and doubles what each graduating batch must hand over.
- *Next.js only with no plan for a backend* — fine for v1 but ignores the check-in goal; D-004 and D-005 cover that.
**Revisit if:** phase 2 needs heavy background jobs, bulk email scheduling, complex multi-role workflows, or an organizer team that really needs a full admin UI. Data access is isolated (D-005) so that move is a backend re-platform, not a site rewrite.

---

## D-004 — Database arrives in phase 2, on Neon's free plan

**Status:** superseded by D-020 for timing and scope (the backend now exists from M0-BE). Neon itself is still the choice.
**Decision (original):** v1 has no database. When the first feature needs stored state, add Postgres on Neon's free plan.
**Rationale:** Unused infrastructure still needs a maintainer. Neon's free plan needs no payment card, scales to zero when idle and offers 0.5 GB of storage, which is ample because content stays in Git. It is standard Postgres, so we can change provider without rewriting.
**Rejected:**
- *Add a database on day one "just in case"* — adds a service and risk to v1 for no benefit.
- *Storing registrations in a spreadsheet only* — cannot verify a QR code at the door, and splits data across tools.
**Revisit if:** storage nears the free limit, or idle wake-up latency becomes noticeable.

---

## D-005 — Data model: small, with content kept in Git

**Status:** decided; amended by D-019 and D-025 (three tables, Django ORM, staff handled by Django auth for now).
**Decision:** The database holds only runtime state in three tables (`events`, `registrations`, `check_ins`), as built in `backend/apps/` and described in `architecture.md` section 3. Organizers are Django users until D-025 is revisited. Data access goes through one isolated module, with migrations committed to the repo.
**Rationale:** This follows a review of the team's draft ER diagram:
- Events, blogs and members move to Git (D-001), so they are not tables. The event row keeps only operational fields keyed by the same slug.
- The diagram's `pwd_hash` is dropped: with Clerk (D-006) we never store passwords. The Admin table becomes `staff`, keyed by the Clerk user id with a role.
- The "manage" links are permissions, not tables, so they become role checks in code.
- The duplicate `college_id` and free-text `college` fields are reduced to one `college` field, because free text produces "MIT-ADT" and "MIT ADT" as different values.
- `registrations` gains a UUID `token` (a QR code must not be guessable), a status for waitlisting, a consent timestamp, and a unique constraint on event plus lower-cased email to stop duplicates.
- `check_ins` records who checked someone in and when, with nullable undo fields, instead of an "undone" status that loses the audit trail.
- `events` gains `starts_at`, `ends_at` as timestamps with timezone, `capacity` and a deadline, without which a waitlist is impossible.
Isolated data access keeps the database swappable and makes schema changes reviewable in pull requests.
**Rejected:**
- *The team's original six-table design with content in the database* — conflicts with D-001 and duplicates content.
- *Vendor-specific calls scattered through components* — makes provider changes a rewrite.
**Revisit if:** M3 starts; then write a change proposal and confirm the schema against the real registration needs.

---

## D-006 — Clerk for organizer sign-in, introduced in phase 2

**Status:** superseded by D-025 (Django's built-in staff accounts first; Clerk stays a candidate).
**Decision (original):** Clerk handles sign-in, for organizers and maintainers only, from phase 2. v1 has no sign-in.
**Rationale:** Authentication is risky to build ourselves. Clerk's free plan covers 50,000 monthly retained users (raised from 10,000 in early 2026), far beyond a club. Waiting until phase 2 keeps v1 simple, since nobody needs to log in before there is an organizer dashboard. Clerk supports user export, which limits lock-in, and its roles let us restrict who can check people in.
**Rejected:**
- *Home-built password auth* — a security liability for no benefit.
- *Requiring every visitor to sign in* — hurts registration completion and the digest audience.
- *Adding Clerk now* — nothing in v1 uses it; see INV-2.
**Revisit if:** member-only content or a member directory is added, which broadens sign-in. Re-check Clerk's free terms yearly.

---

## D-007 — Attendees register without accounts and receive a QR token

**Status:** decided
**Decision:** Registration collects basic details, stores a record with a unique token, and emails a QR code. Organizers scan it at the door. Attendees never create accounts.
**Rationale:** Every extra step lowers registration completion, and these are students on phones. A token proves a registration at the door without passwords or account management, and less stored personal data means less privacy risk. Venue Wi-Fi may fail, so organizers also export a CSV before the event as an offline fallback.
**Rejected:**
- *Mandatory attendee login* — friction and more data to protect.
- *Check-in by name search only* — slow at a 300-person door and error-prone.
**Revisit if:** attendees need a persistent profile, such as a certificates history or member perks.

---

## D-008 — Hosting: Vercel Hobby now, Cloudflare as the named fallback

**Status:** decided
**Decision:** Deploy on Vercel's free Hobby plan from the org repository, as the QFF site does. Fall back to Cloudflare Pages or GitHub Pages for the static site if Hobby does not fit.
**Rationale:** Zero cost, no card, first-class Next.js support, and the team already knows it. Static pages cost almost nothing to serve. The known risk: Hobby is licensed for personal, non-commercial use by a single developer, and hitting a usage cap pauses the site rather than billing. A student club with no revenue is plausibly within the spirit of that rule, but paid sponsorship or ticketing could cross it.
**Rejected:**
- *Render, Fly.io or Koyeb for the site* — sleeping instances or card holds; no benefit for a static site.
- *GitHub Pages only* — cannot host the Django API or any server code.
**Revisit if:** the club takes paid sponsorship or revenue, hits usage caps, or needs several people to deploy. Verify the org-repository question in M0-DEP-01.

---

## D-009 — Registration in v1 uses an external form

**Status:** decided
**Decision:** Event pages link to a free external form tool until M3. The link is the `registration_url` field.
**Rationale:** It puts events online immediately at no build cost and lets the club learn what data it actually needs before designing a schema.
**Rejected:**
- *Building registration before launch* — delays v1 for one feature.
- *A registration box that does nothing* — violates the "never fake a capability" rule.
**Revisit if:** the first event that wants QR check-in.

---

## D-010 — Media lives in the repo first; object storage only with approval

**Status:** decided
**Decision:** Compressed images are committed under `public/images`. Cloudflare R2 is considered only in the later Community phase.
**Rationale:** The repo is simplest until volume says otherwise. R2 offers 10 GB free with no egress fees but needs a payment method on file to activate, which a student club should take on deliberately and with college or faculty backing, not by accident.
**Rejected:**
- *R2 from day one* — a card requirement and setup cost with no early benefit.
- *Hot-linking images from social media* — they disappear.
**Revisit if:** images or uploads exceed what a repo should hold, or galleries grow large.

---

## D-011 — The digest is blog-first; social posts derive from it; email comes later

**Status:** decided
**Decision:** Each issue is published as a blog post with an RSS feed. The team turns each issue into Instagram and LinkedIn posts using a generated card image. An email newsletter is a later item.
**Rationale:** This matches how the team will actually publish. The blog is the canonical, searchable record and social posts are discovery channels pointing back to it. Email needs a provider, a consent process and ongoing deliverability care, none of which are needed to start. RSS costs nothing and serves readers who follow feeds.
**Rejected:**
- *Newsletter first* — infrastructure before an audience exists.
- *Social only* — not searchable and not owned by the club.
**Revisit if:** a regular readership exists and people ask for email delivery.

---

## D-012 — The club site is a separate repository from event microsites

**Status:** decided
**Decision:** The club site and event sites such as the QFF 2026 site live in separate repositories. Event sites are linked from the club site, and visual tokens are copied by hand when wanted.
**Rationale:** Event sites have a short life and their own deadlines, while the club site must stay stable. Separation stops an event-week rush from breaking the permanent site.
**Rejected:**
- *A monorepo with a shared package* — more tooling than a student team can maintain right now.
- *Hosting events as sections of the club site* — expires badly and mixes deadlines.
**Revisit if:** copying shared components becomes a burden; then extract a small shared package.

---

## D-013 — Club-owned accounts, named owners, yearly handover

**Status:** decided
**Decision:** The GitHub org, hosting, domain, database and email accounts belong to the club (a shared role mailbox where possible), with at least two named admins, a recovery path and a handover checklist each year in `docs/HANDOVER.md`.
**Rationale:** Services tied to one student's account vanish when that student graduates. This is the most common way club websites die.
**Rejected:**
- *Personal accounts for convenience* — single point of failure.
- *Leaving handover informal* — it does not happen under exam pressure.
**Revisit if:** never; this is a standing rule.

---

## D-014 — Plain CSS, no UI framework

**Status:** decided
**Decision:** Styling is one hand-written stylesheet, `src/app/globals.css`, using CSS variables for colours and spacing. No Tailwind or component library.
**Rationale:** Fewer dependencies, no build-config or version churn, easy for a beginner to read and for a designer to change, and the site is small enough that a single file stays manageable.
**Rejected:**
- *Tailwind* — extra configuration and a utility-class vocabulary every new member must learn.
- *A component library* — dependency weight and a look that is hard to make distinctive.
**Revisit if:** the stylesheet passes roughly 600 lines or several people edit it at once and conflict.

---

## D-015 — Front-matter is validated strictly with zod, and the build fails on errors

**Status:** decided
**Decision:** Every content file is validated by a strict zod schema when the site loads it. An unknown key, missing field or malformed value fails the build with the file and field named.
**Rationale:** A typo such as `start_at` instead of `starts_at` would otherwise produce a page that quietly shows nothing. Failing on the pull request is far cheaper than a visitor finding the gap.
**Rejected:**
- *Lenient parsing that skips bad files* — pages go missing without anyone noticing.
- *Manual review only* — reviewers miss typos in YAML.
**Revisit if:** zod 4 migration is wanted; schemas use only features common to both.

---

## D-016 — Tests use Node's built-in runner through tsx

**Status:** decided
**Decision:** Tests are TypeScript files in `tests/` run with `tsx --test`. No separate test framework.
**Rationale:** The logic worth testing is pure functions and file loading, which need nothing more. It adds one small dev dependency, runs in about a second, and keeps the fast gate fast.
**Rejected:**
- *Vitest or Jest* — extra dependencies and configuration for tests this simple.
**Revisit if:** component tests are needed; then add Vitest with a decision entry.

---

## D-017 — Markdown, not MDX, in v1

**Status:** decided
**Decision:** Content bodies are plain Markdown rendered with `marked`. No embedded React components inside articles.
**Rationale:** Writers can use it without knowing JSX, a typo cannot crash a build with a cryptic error, and the content stays portable to any other tool.
**Rejected:**
- *MDX* — more powerful, but it turns every article into code that can break the build and raises the bar for non-developer writers.
**Revisit if:** articles need interactive components, such as a circuit widget. Consider MDX for a limited set of files only.

---

## D-018 — Pages that depend on "now" refresh hourly

**Status:** decided
**Decision:** The Home and Events pages, which split upcoming from past events, are regenerated at most once an hour (`REVALIDATE_SECONDS = 3600`).
**Rationale:** A fully static build freezes "upcoming" at build time, so an event that has passed would still show as upcoming until the next deploy. Hourly regeneration keeps the pages correct without a database and without client-side code.
**Rejected:**
- *Rendering on every request* — slower and uses more of the free quota.
- *Splitting events in the browser with JavaScript* — shows wrong content without JavaScript and delays first paint.
**Revisit if:** the site moves to a host without incremental regeneration.


---

## D-019 — Django REST Framework for the backend

**Status:** decided (team meeting, 2026-10-15)
**Decision:** Runtime state (event capacity, registration, check-in) is served by a Django REST Framework API in `backend/`. The public site stays a Next.js app at the repository root that reads content from Git.
**Rationale:** The team chose it after comparing Next.js route handlers, Express, Nest and FastAPI. Django brings a mature ORM with migrations, a built-in admin for organizers on event day, built-in auth, and a large student-friendly ecosystem. Python is also the language of Qiskit, so members already write it. The earlier worry (a second codebase to hand over) is real, so the backend is kept deliberately small: three tables, four public routes, no content in it.
**Rejected:**
- *Next.js route handlers only* — one codebase and one host, but no admin panel and no ORM; the team preferred Django.
- *Express or Nest* — more assembly (auth, admin, migrations) than Django ships with.
- *FastAPI* — excellent for APIs, but no admin and no bundled auth.
**Revisit if:** the team finds two codebases too heavy to maintain after the first handover.

---

## D-020 — Postgres on Neon; not Firebase or Supabase

**Status:** decided
**Decision:** The database is Postgres on Neon's free plan, read through `DATABASE_URL`. Local development and tests use SQLite.
**Rationale:** The team evaluated Neon, Firebase and Supabase.
- Firebase's Firestore is NoSQL. Django's ORM does not support it, so choosing Firebase would mean abandoning D-019.
- Supabase is Postgres and would work, but its free projects pause after 7 days without requests, which fits a club that is quiet between events. Neon also scales to zero but wakes by itself on the next connection.
- Neon's free plan (checked Oct 2026) needs no card, gives 0.5 GB per project and 100 compute-hours per month. Registration data is tiny, so this is ample.
Because Django speaks to Postgres through the ORM, changing provider later means changing `DATABASE_URL`.
**Rejected:**
- *Firebase* — see above.
- *Supabase* — workable; pauses after a week of silence. Fall back to it if Neon's terms change.
- *SQLite in production* — free hosts have no persistent disk, so data would vanish.
**Revisit if:** storage nears 0.5 GB, or Neon changes its free terms. Re-check each semester.

---

## D-021 — Backend hosting: Render free web service, with content independent of it

**Status:** decided, UNVERIFIED until task M0-BE-02 (first real deploy)
**Decision:** Host the Django API on Render's free web service, deployed from `render.yaml`. The health route `/api/health/` never touches the database, so Render's checks do not wake Neon.
**Rationale:** The team evaluated Railway, Render, Heroku and Cloudflare Workers (checked Oct 2026).
- Heroku has no free tier.
- Railway gives a one-time $5 trial credit for 30 days, then $5 a month; INV-1 forbids that.
- Render's free web service is genuinely free with no card for a web service. Its costs: it sleeps after 15 minutes idle and takes about a minute to wake, has 750 instance-hours a month, no persistent disk, and blocks outbound SMTP ports (so email must use an HTTP email API). Render's own free Postgres expires after 30 days, which is why the database is Neon (D-020).
- Cloudflare Python Workers can run Django, but the Django ORM with Postgres through Hyperdrive is unproven. It is a spike (M3-SPIKE-01), not a plan.
Because the API sleeps, content pages must never need it (INV-2). Registration pages call `/api/health/` on load to warm it. Around an event, organizers can add an external pinger.
**Rejected:**
- *Railway* — recurring cost.
- *Heroku* — no free tier.
- *Cloudflare Workers now* — unverified with Django ORM and Postgres.
**Revisit if:** the cold start annoys registrants, the club gets sponsorship money, or the Workers spike succeeds.

---

## D-022 — Repository layout: Next.js at the root, Django in `backend/`

**Status:** decided
**Decision:** One repository. The Next.js app, `content/` and `tests/` sit at the root; the Django project lives in `backend/` with its own `requirements.txt` and tests.
**Rationale:** Vercel expects the Next.js app at the root, and one repository means one pull request can change content, page and API together, with one set of specs and one CI run. Splitting into two repositories doubles the review and handover work.
**Rejected:**
- *Two repositories* — more to hand over; changes that span both need two pull requests.
- *Next.js under `frontend/`* — needs extra Vercel root-directory configuration for no gain.
**Revisit if:** the backend grows its own team or release rhythm.

---

## D-023 — Django 5.2 LTS, Python 3.12

**Status:** decided
**Decision:** Pin Django to the 5.2 LTS line (`>=5.2,<5.3`) and Python to 3.12. Dependencies in `backend/requirements.txt` are version-ranged.
**Rationale:** LTS receives security fixes for years, so a rotating team is not forced into a yearly upgrade. Ranges accept patches but not surprise major versions.
**Rejected:**
- *Latest non-LTS Django* — shorter support window.
- *Unpinned dependencies* — a build that works today may break next month.
**Revisit if:** 5.2 nears end of support (April 2028).

---

## D-024 — Events are split: Markdown for content, the database for state

**Status:** decided
**Decision:** The event's description, venue, speakers and poster live in `content/events/<slug>.md`. The database `Event` row holds only capacity, registration status and deadline, joined by the same slug. The Markdown file stays the source of truth for what the event is; the database is the source of truth for how full it is.
**Rationale:** It keeps D-001 intact (content is reviewed in pull requests) while giving registration a capacity to enforce. The slug is the only coupling.
**Rejected:**
- *All event fields in the database* — duplicates content and loses review.
- *Capacity in Markdown* — a front-matter edit and redeploy to close registration is too slow on event day.
**Revisit if:** the two drift in practice. Add a check that every open `Event` row has a Markdown file (task M3-EVT-01).

---

## D-025 — Organizer sign-in: Django staff accounts now; Clerk deferred

**Status:** decided
**Decision:** Organizers sign in through Django's built-in staff accounts (the admin). The API default permission is `IsAdminUser`. Clerk is not integrated. `CheckIn.checked_in_by` records the staff username as a plain string.
**Rationale:** Django already ships auth and admin, so adding Clerk would be a second system doing the same job. The attendee side needs no accounts at all (D-007). Clerk's free plan (50,000 monthly retained users) remains a candidate if organizers need social sign-in.
**Rejected:**
- *Clerk now* — duplicates Django's auth for no v1 gain.
- *Home-built password auth* — Django's is audited and free.
**Revisit if:** members want sign-in on the Next.js site, or organizers need Google sign-in. Then decide between Clerk and `django-allauth`.

---

## D-026 — The database design covers runtime state for the whole site; content stays in Git

**Status:** decided (design only; only Event, Registration and CheckIn are built)
**Decision:** The site's data design is published in `docs/database/`. It has three built tables, one planned table (`EmailLog`, M3) and three later ones (`Subscriber`, `MembershipApplication`, `Certificate`). Digest, events' text, projects, members and pages are not tables. The API route list in that document is a proposal; each planned route requires an approved change proposal before implementation. Any new public route must also be deliberately added to the INV-8 public-route list and tests. A proposed public route that returns personal data requires explicit approval to update the applicable INV-8 privacy rule and tests before implementation.
**Rationale:** The team asked for one design that shows how the whole backend fits together, so API work does not start from guesses. Showing the Git content next to the tables makes the single join (event slug) and the reason for it visible. Later tables are drawn now so that today's tables do not block them (for example, `Registration` already has a token and consent timestamp that `Certificate` and `EmailLog` build on), but they are marked as not scheduled so nobody builds them early.
**Rejected:**
- *Every content type as a table* — reverses D-001: loses pull-request review and Git history, and needs an editor UI.
- *Drawing only the built tables* — leaves the API contract to be guessed per feature.
- *Foreign key from `CheckIn` to the staff user* — deleting a staff account would damage the audit trail; a text copy of the username survives (D-025).
**Revisit if:** the team decides Django's admin should manage events or blog posts (that needs a new decision superseding D-001), or when M3 starts and the real registration fields are confirmed.

---

## D-027 — anime.js for frontend animations

**Status:** decided
**Decision:** `animejs` is permitted as a frontend animation library to power smooth geometric transitions, accent block movement, and scroll reveal animations.
**Rationale:** Lightweight (zero external dependencies), runs completely in client browsers at zero hosting cost, and provides smooth programmatic easing for editorial layout elements without heavy UI runtime overhead.
**Rejected:**
- *Heavy 3D or full physics engines* — too large and impacts mobile load times.
- *CSS-only for complex sequenced choreography* — difficult to coordinate dynamically across interactive cards.
**Revisit if:** CSS native animation capabilities or lighter micro-utilities suffice for the design requirements.
