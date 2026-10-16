# tasks.md — Backlog

One task = one change = one commit. A task is ready to hand to someone else when it names its files, has observable "done when" criteria and says what not to touch. Tick the box and add a one-line note when done — the box is ticked from the verifier's report, not by the implementer.

Task ID format: `M<milestone>-<area>-<number>`. Requirement IDs (R-nnn) are in `requirements.md`.

---

## M0 — Walking skeleton

The scaffold below was generated in one pass. Its boxes stay unticked until a verifier has run it on a machine with npm access.

### Repo and tooling
- [ ] **M0-REPO-01** Install dependencies and commit the lockfile. (human, 15 min)
  - Run `npm install`, then `npm run verify`. Commit `package-lock.json` only.
  - Done when: `npm ci && npm run verify` exits 0 on a fresh clone. Paste the output summary into `AGENT_LOG.md`.
  - If `verify` fails, fix the smallest thing and record each fix as its own entry in the log. Do not touch `CONTRACT.md`.
- [ ] **M0-REPO-02** Add ESLint with the Next.js flat config.
  - Files: `eslint.config.mjs`, `package.json` (add `lint` script, add it to `verify`), `spec/decisions.md` (record the dev dependencies and add them to the allowlist in `tests/invariants.test.ts`).
  - Done when: `npm run lint` exits 0 and a deliberate unused variable makes it fail.
  - Do not touch: anything under `src/` except to fix lint errors it reports.

### Content layer (scaffolded)
- [ ] **M0-CONT-01** Content loader and schemas.
  - Files: `src/lib/content/schema.ts`, `src/lib/content/load.ts`, `src/lib/content/tags.ts`.
  - Done when: tests G-06, N-01, N-02, N-03, N-05, N-06, N-07, INV-3-T and INV-4-T pass.
- [ ] **M0-CONT-02** Dates, markdown, RSS and site URL helpers.
  - Files: `src/lib/dates.ts`, `src/lib/content/markdown.ts`, `src/lib/rss.ts`, `src/lib/site-url.ts`.
  - Done when: tests G-01, G-02, G-03, G-04, G-05, N-04 and INV-5-T pass.
- [ ] **M0-TEST-01** Test suite tagged with eval IDs.
  - Files: everything in `tests/`.
  - Done when: `npm test` runs at least 25 tests, none skipped, and `python3 scripts/spec_lint.py --strict` reports no untested eval ID.

### Pages and CI (scaffolded)
- [ ] **M0-PAGE-01** Route skeletons for every page with sample content.
  - Files: `src/app/**`, `src/components/**`, `content/**`, `src/app/globals.css`.
  - Done when: `npm run build` succeeds and `npm start` serves `/`, `/digest`, `/digest/issue-001-welcome-to-the-digest`, `/events`, `/events/qff-2026`, `/projects`, `/team`, `/about`, `/join`, `/feed.xml`, `/sitemap.xml`, `/robots.txt` and a 404 for `/nope`.
  - Do not touch: `src/lib/**`.
- [ ] **M0-CI-01** CI gate on every push and pull request.
  - Files: `.github/workflows/spec-gate.yml`, `scripts/spec-gate.sh`.
  - Done when: the workflow runs spec lint in strict mode, typecheck, tests and build, and a deliberately broken test turns it red. Needs M0-REPO-01 first (`npm ci` requires the lockfile).

### Backend skeleton (scaffolded: Django REST Framework, D-019)
- [ ] **M0-BE-01** Install the backend and run its tests on a clean machine. (human, 20 min)
  - Steps in `backend/README.md`: create a virtualenv, `pip install -r backend/requirements.txt`, `DJANGO_DEBUG=1 python backend/manage.py test`.
  - Done when: all backend tests pass (G-10 to G-13, N-08, N-09, N-11, N-12, INV-1-T, INV-6-T, INV-7-T, INV-8-T) and `manage.py makemigrations --check` reports no changes. Paste the summary into `AGENT_LOG.md`.
  - Do not touch: `CONTRACT.md`, `backend/tests/test_invariants.py`.
- [ ] **M0-BE-02** First deploy of the API to Render, with Neon. (human, 1 hour)
  - Create a Neon project and a Render web service from `render.yaml`; set `DATABASE_URL`, `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` in the Render dashboard (names only in the repo, never values). Record the free-tier facts in `docs/HANDOVER.md`.
  - Done when: `curl https://<service>.onrender.com/api/health/` returns `{"status":"ok"}` and `/api/health/db/` returns 200 with the database up. Note the cold-start time in `AGENT_LOG.md`. `render.yaml` is UNVERIFIED until this passes (D-021).
  - Do not touch: anything under `src/`.

### Deploy and ownership (human)
- [ ] **M0-DEP-01** Deploy to Vercel Hobby from the org repository.
  - Check first whether Hobby allows this club's use from the `qquestclub` org (open question in `requirements.md`). If not, use the fallback in D-008.
  - Done when: the deployed home page source contains no `localhost` and the URL is written in `BRIEF.md`.
- [ ] **M0-OWN-01** Record owners and fill the handover checklist.
  - Files: `docs/HANDOVER.md` only.
  - Done when: at least 2 named admins are listed for the GitHub org, Vercel and the domain, plus the club role mailbox that owns the accounts.

---

## M1 — Launch

### Identity
- [ ] **M1-BRAND-01** Decide the club name story, tagline and digest name.
  - A human decision. Write it as a new entry in `spec/decisions.md`, then update `src/lib/site.ts` (tagline, description, digest name).
  - Done when: `decisions.md` has the entry with rejected options, and the site header and home page use the decided wording.
  - Do not touch: layout or CSS.
- [ ] **M1-BRAND-02** Logo and colours.
  - Files: `public/logo.svg`, the colour variables at the top of `src/app/globals.css`, `src/components/Header.tsx` (logo only).
  - Done when: light and dark colour pairs both pass a 4.5:1 text contrast check and the logo shows in the header at 360 px.
- [ ] **M1-ABT-01** Write the real About page, including the meaning of "kyu QQuEST".
  - Files: `content/pages/about.md` only. Needs M1-BRAND-01.
  - Done when: no sample text remains and a second member has reviewed it.
- [ ] **M1-JOIN-01** Write the real Join page with the sign-up form link.
  - Files: `content/pages/join.md` only (`cta_url` points to the external form, https).
  - Done when: the button opens the live form.

### Pages and features
- [ ] **M1-HOME-01** Finish the Home page.
  - Files: `src/app/page.tsx`, `src/app/globals.css`. Needs M1-BRAND-01.
  - Done when: it satisfies R-005, including the case with no upcoming event (shows a friendly line, not an empty box).
  - Do not touch: `src/lib/**`.
- [ ] **M1-DIG-01** Tag filter pages for the digest.
  - Files: `src/app/digest/tag/[tag]/page.tsx` (new), `src/app/digest/page.tsx` (tag links), `src/lib/content/tags.ts` only if a tag is genuinely missing.
  - Done when: `/digest/tag/hardware` lists only issues tagged hardware, a tag with no issues is not generated, and R-018 holds.
- [ ] **M1-DIG-02** 1200 x 630 share-preview image per issue.
  - Files: `src/app/digest/[slug]/opengraph-image.tsx` (new). Uses `next/og`. Title, issue number and site name only.
  - Done when: `/digest/<slug>/opengraph-image` returns a PNG of 1200 x 630 and the issue page's meta tags point to it.
- [ ] **M1-DIG-03** 1080 x 1350 Instagram card per issue.
  - Files: `src/app/digest/[slug]/card/route.tsx` (new). Same design family as M1-DIG-02.
  - Done when: `/digest/<slug>/card` returns a 1080 x 1350 PNG and a long title wraps without clipping (test with a 120-character title).
- [ ] **M1-DIG-05** Validate the RSS feed.
  - Run the deployed `/feed.xml` through the W3C feed validator; fix `src/lib/rss.ts` if needed and keep G-04 and N-04 passing.
  - Done when: the validator reports no errors; record the date and result in `evals.md`.
- [ ] **M1-SEO-01** Structured data for events and articles.
  - Files: `src/lib/jsonld.ts` (new, with a test tagged G-07 in `evals.md`), `src/app/events/[slug]/page.tsx`, `src/app/digest/[slug]/page.tsx`.
  - Done when: the Google Rich Results test accepts one event page and one issue page.

### Content (humans, with review)
- [ ] **M1-TEAM-01** Add real members and remove the sample member.
  - Files: `content/members/*.md`. Needs each person's consent for any photo or link (see CONTRACT "never do this").
  - Done when: the Team page shows real members, no file named `sample-*` remains, and `npm run verify` passes.
- [ ] **M1-DIG-04** Write the first 3 real digest issues.
  - Files: `content/digest/issue-001-*.md` onward (replace the sample issue). Follow `docs/CONTRIBUTING.md`.
  - Done when: each issue has at least one primary source, was reviewed by a second member who checked every claim against its source, and `npm run verify` passes.
- [ ] **M1-EVT-01** Add real events: check QFF 2026 and add at least 2 more.
  - Files: `content/events/*.md`. Remove the sample past event.
  - Done when: every event has a correct offset time (INV-4) and R-014 holds.
- [ ] **M1-PRJ-01** Add at least 3 real projects with team credit.
  - Files: `content/projects/*.md`. Fix the team on the QFF site entry.
  - Done when: R-025 holds and every project links its repo or write-up.

### Quality and launch
- [ ] **M1-A11Y-01** Accessibility pass.
  - Check keyboard-only navigation of every page, visible focus, alt text, contrast, and reduced-motion behavior. Fix in `src/app/globals.css` and components.
  - Done when: `smoke.md` section 5 passes and any exceptions are recorded in `evals.md`.
- [ ] **M1-PERF-01** Lighthouse on the deployed preview.
  - Run mobile Lighthouse on `/`, `/digest` and one issue page. Fix images and layout shifts.
  - Done when: performance and accessibility are each at least 90 on all three pages, with scores recorded in `evals.md`.
- [ ] **M1-DOC-01** Contributor dry run.
  - Ask a member who does not code to publish a sample issue through the GitHub website following `docs/CONTRIBUTING.md`, with you only watching.
  - Done when: they succeed unaided, or every point where they got stuck has been fixed in the guide.
- [ ] **M1-DEP-02** Domain decision and attachment.
  - Decide club-owned domain, university subdomain, or staying on `vercel.app`; record in `decisions.md`; attach it and set `NEXT_PUBLIC_SITE_URL` in Vercel.
  - Done when: view-source of the live home page shows the final domain in canonical and share-preview tags.

---

## M2 — Polish

Do not start until M1 is closed.

- [ ] **M2-SRCH-01** Site search over digest, events and projects (static index, no server). Files named in the task's change proposal.
- [ ] **M2-EVT-01** Add-to-calendar (.ics) for upcoming events. Times must keep the IST offset.
- [ ] **M2-EVT-02** Event recap section: photos and slides for past events.
- [ ] **M2-OPS-01** Privacy-friendly analytics. Adds a vendor, so it needs a `decisions.md` entry and an allowlist change first.
- [ ] **M2-RES-01** Resources page with beginner learning paths.
- [ ] **M2-ACH-01** Achievements timeline.
- [ ] **M2-THEME-01** Light and dark theme toggle that remembers the choice.

---

## M3 — Event management

Do not start until M1 is closed and M0-BE-02 has passed. Triggered by the first event that wants check-in (see `plan.md`). Each task begins with a change proposal in `spec/changes/` because it widens the public API (INV-8) and stores personal data.

- [ ] **M3-REG-01** Public registration endpoint with capacity, waitlist, deadline and duplicate rejection. Adds one route to the INV-8 list on purpose. Done when R-051 to R-053 hold, and registration responses never include other people's data.
- [ ] **M3-REG-02** Organizer check-in and undo endpoints (staff only), by QR token. Done when R-054 and R-055 hold and INV-7-T still passes.
- [ ] **M3-REG-03** Organizer list and CSV export (staff only; Django admin action first). Done when R-056 holds and the CSV opens in a spreadsheet.
- [ ] **M3-REG-04** Registration form on the event page. Warms the API on load, shows a clear waiting or failure message, and stays client-side only (INV-2). Done when R-057 holds with the API switched off.
- [ ] **M3-REG-05** QR email through a free HTTP email API. Needs a decision entry for the provider. Done when R-058 holds.
- [ ] **M3-EVT-01** Check that every open `Event` row has a matching Markdown file in `content/events/` (D-024). Done when a mismatch fails CI with the slug named.
- [ ] **M3-SPIKE-01** Time-boxed (one day) spike: can Django ORM with Postgres run on Cloudflare Python Workers? Output: a recorded finding in `decisions.md`, no production change. Done when D-021's Cloudflare line is replaced with evidence.

---

## Backlog — unscheduled, do not start

- Email newsletter (R-F01), Google sign-in for organizers (R-F03).
- Member profiles, certificates, uploads, comments.
- Auto-pulling repository stats from the GitHub org — nice, not needed.
- A press kit page of logo downloads — low urgency.
