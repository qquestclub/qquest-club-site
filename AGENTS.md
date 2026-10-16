# AGENTS.md — QQuEST Club Website

**Read this completely before touching any code.**

**Rigor level:** spec-anchored — see the spec-driven-development skill, `references/enforcement.md` section 1. Chosen because the site must outlive its first team and be handed between people and agents.

---

## 1. Read order

1. `AGENTS.md` — this file
2. `CONTRACT.md` — what must never break
3. `spec/architecture.md` — stack, structure, capabilities
4. `spec/plan.md` — which milestone is active
5. `spec/tasks.md` — the specific task
6. `AGENT_LOG.md` — top 3 entries, for current state

Read `spec/requirements.md` to see which requirement a task serves. Read `spec/evals.md` before claiming anything works. Read `spec/smoke.md` before any deploy. Read `spec/decisions.md` before proposing an architectural change — it may already have been rejected. For any change bigger than one task, write a proposal in `spec/changes/` first (template: `spec/changes/_template/proposal.md`) and wait for approval.

**You do not verify your own work.** When you finish a task, report it; a separate verifier checks it against the spec before the checkbox is ticked.

**If a task conflicts with `CONTRACT.md`, the contract wins.** Stop and flag it. Do not silently resolve.

Non-developers publishing content follow `docs/CONTRIBUTING.md` instead; this file is for people and agents changing code.

---

## 2. Hard invariants

Never break these without explicit human approval. Full detail and tests are in `CONTRACT.md`.

### INV-1 — Zero recurring cost
No paid service, and no dependency outside the allowlists in `tests/invariants.test.ts` (website) and `backend/tests/test_invariants.py` (API). Adding one needs a `decisions.md` entry.

### INV-2 — Content pages work with the API off
No database client, auth SDK, secret or API call under `src/` for rendering content. Only the registration form may call the API, from the browser.

### INV-3 — Every published digest issue cites sources
The schema enforces at least one source. Do not loosen it.

### INV-4 — Event times carry an offset and display in IST
Always go through `formatEventDate`. Never format a date with the machine's local zone.

### INV-5 — No localhost URL in production
Only `getSiteUrl()` produces the site URL.

### INV-6 — One registration per person per event
A database constraint on event plus lower-cased email. Never replace it with a check in a view.

### INV-7 — Check-in integrity
One check-in per registration; an undo keeps the row and records who and when; a checked-in registration cannot be deleted.

### INV-8 — No personal data on public endpoints
Exactly four public routes (health, health/db, events, events/<slug>). Everything else is staff-only by default. A new public route needs a change proposal and a deliberate edit to the test list.

---

## 3. Stack — pinned

Website ranges are what `package.json` declares; exact versions are fixed by `package-lock.json` once task M0-REPO-01 commits it (use `npm ci`, never `npm install`, after that). Backend ranges are in `backend/requirements.txt`.

| Layer | Choice | Version range |
|---|---|---|
| Site language | TypeScript (strict) | ^5.9 |
| Site runtime | Node.js | 22 (see `.nvmrc`); minimum 20.9 |
| Site framework | Next.js, App Router | ^16.0 |
| UI | React, plain CSS in `src/app/globals.css` | ^19.2 |
| Content | Markdown files + YAML front-matter | `yaml` ^2.8, `marked` ^18.0.10 |
| Site validation | zod | ^3.25.76 |
| Site tests | Node's built-in test runner via `tsx` | tsx ^4.20 |
| Site hosting | Vercel Hobby (fallback in `decisions.md`) | — |
| Backend | Python 3.12, Django (5.2 LTS), Django REST Framework | `>=5.2,<5.3`, `>=3.16,<4` |
| Backend tests | `python manage.py test` (Django runner) | — |
| Database | Postgres on Neon free via `DATABASE_URL`; SQLite locally | — |
| API hosting | Render free web service (`render.yaml`) | — |
| Organizer auth | Django staff accounts (Clerk deferred, D-025) | — |

Do not add a dependency without checking: is it needed, is it maintained, does it work on free hosting, what does it cost on the critical path? Record additions in `spec/decisions.md` and the allowlist.

---

## 4. Working rules

**One task per change.** Do not batch. Do not refactor files you were not asked to touch.

**Report what you changed.** Files created, files modified, exported symbols changed, spec files needing updates, and anything noticed but not fixed.

**Update the spec when reality diverges** — in the same change, not later.

**Do not invent.** If you need a value, a convention or a capability and it is not in `CONTRACT.md` or `spec/architecture.md`, ask. Do not choose one and proceed.

**Prefer improving over adding.** When choosing between a new feature and making an existing one work properly, improve the existing one.

**Backend rules.** Run it with `DJANGO_DEBUG=1` locally. Every new model change ships with its migration (`makemigrations --check` must be clean). Every new route is staff-only unless a change proposal puts it on the INV-8 list. Errors use the standard `{code, message, details?}` shape.

**Keep pages server-rendered.** No `use client` component unless a task justifies it; most of the site is plain pages.

**Never write a real secret into a tracked file.** Not in a test fixture, not in a README example, not commented out, not "temporarily". The website's only environment variable is the optional `NEXT_PUBLIC_SITE_URL` (see `.env.example`). The API's secrets (`DJANGO_SECRET_KEY`, `DATABASE_URL`) live only in the Render dashboard; `backend/.env.example` lists names, never values. If you need a credential and cannot find one, stop and ask.

**Commit format:** `type(scope): task-id summary`, for example `feat(digest): M1-DIG-01 add tag pages`.

---

## 5. Definition of done

- [ ] `npm run verify` passes (spec lint, typecheck, website tests, backend tests, build)
- [ ] Acceptance criteria observably met
- [ ] Relevant test in `spec/evals.md` passes
- [ ] `spec/smoke.md` passes for the affected area
- [ ] Spec updated if behaviour diverged
- [ ] `spec/tasks.md` checkbox ticked (by the verifier's report, not the implementer)
- [ ] `AGENT_LOG.md` entry written
- [ ] Committed as `type(scope): task-id summary`

"It builds" is not done.

---

## 6. Vocabulary

Use these words with these meanings, consistently.

- **Digest** — the weekly blog on what happened in quantum. **Issue** — one edition.
- **Content file** — a Markdown file in `content/` with front-matter.
- **Member slug** — a member file's name without `.md`.
- **Microsite** — a separate site for a single event.
- **Organizer** — a person running an event; signs in with a Django staff account.
- **Registration** — one person's sign-up for one event. **Check-in** — an organizer marking them present at the door.
- **Milestone** — M0 skeleton (site + API), M1 launch, M2 polish, M3 event management; later phases are in `spec/plan.md`.

Words to avoid: "newsletter" for the blog (it means email, which is a later phase) → say "digest". "Admin" for a content reviewer → say "reviewer" or "maintainer"; "admin" means the Django admin only.
