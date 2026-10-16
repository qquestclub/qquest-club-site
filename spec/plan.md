# plan.md — Milestones

Sequential. Do not start M(n+1) before M(n)'s exit criteria are met.

**Currently active: M0.** (M3 was previously called "phase 2".)

---

## M0 — Walking skeleton ⏱ about 1 evening for the human steps · cost ₹0

The scaffold exists; this milestone proves it works on a clean machine, deploys, and has owners. It is first because everything else builds on a pipeline that is known to work.

**Deliverables**
- Dependencies installed and `package-lock.json` committed
- Every route renders sample content
- The Django API installed locally with its tests passing (M0-BE-01), then deployed on Render with Neon (M0-BE-02)
- CI passing, preview deployed on Vercel
- Named owners for the GitHub org, hosting and domain

**Exit criteria**
- [ ] On a clean clone, `npm ci && npm run verify` exits 0 (this includes the backend tests)
- [ ] `https://<api-host>/api/health/` answers from the internet and `/api/health/db/` answers 200
- [ ] The CI workflow `spec-gate` is green on the default branch
- [ ] A Vercel URL serves the home page, `/digest`, `/events`, `/projects`, `/team`, `/about`, `/join` and `/feed.xml`
- [ ] The page source of the deployed home page contains no `localhost`
- [ ] `docs/HANDOVER.md` lists at least 2 named admins for GitHub, Vercel and the domain

**Risk:** the scaffold was written without being built (see the first `AGENT_LOG.md` entry), so the first `next build` may reveal small fixes. Treat them as normal M0 work and log them.

---

## M1 — Launch ⏱ 2 to 3 weeks part-time

The site goes public with real identity and real content.

**Deliverables**
- Club identity applied: name story, tagline, logo, colours, digest name
- Real About, Join, Team, Events, Projects and at least 3 digest issues
- Tag pages, social preview images, Instagram cards, structured data
- Accessibility and performance pass; contributor guide tested by a non-developer

**Exit criteria**
- [ ] At least 3 real digest issues, 3 real projects and 3 real events are live
- [ ] Sample content is gone: no page contains the word "sample" in a title
- [ ] Mobile Lighthouse performance and accessibility are each at least 90, recorded in `evals.md`
- [ ] A non-developer published a digest issue through the GitHub website by following `docs/CONTRIBUTING.md`
- [ ] Canonical and share-preview URLs use the production domain
- [ ] Open questions in `requirements.md` section 5 are answered and recorded in `decisions.md`

---

## M2 — Polish ⏱ 2 weeks, starts about a month after launch

**Deliverables**
- Search, add-to-calendar, event recaps, analytics, Resources page, achievements timeline, theme toggle

**Exit criteria**
- [ ] Each requirement R-040 to R-045 passes its acceptance criteria in `tasks.md`
- [ ] The digest has published weekly for at least 4 weeks (proves the workflow before we add more)

---

## M3 — Event management ⏱ 3 to 4 weeks part-time, starts when the trigger fires

**Trigger:** the next in-person event wants check-in, and M1 is closed.

**Deliverables**
- Registration with capacity, waitlist and duplicate protection
- QR email through a free HTTP email API
- Organizer check-in, undo and CSV export
- Registration form on event pages that tolerates a sleeping API
- Spike: Django on Cloudflare Workers (recorded as a decision either way)

**Exit criteria**
- [ ] A real event ran with on-site registration and QR check-in, and the CSV fallback was tested the day before
- [ ] INV-6-T, INV-7-T and INV-8-T pass, and the public route list contains only the routes written down on purpose
- [ ] Registrant data has a stated retention period and a deletion path

---

## Later phases — decided, not scheduled

These are not milestones with tasks. They start only when the trigger fires, and each begins with a change proposal in `spec/changes/`.

| Phase | Contents | Start when |
|---|---|---|
| Email newsletter | Subscribe with double opt-in, send each issue by email | The digest has a regular readership asking for email |
| Community | Member profiles, certificates from attendance, media in object storage (R2 needs a card), a Git-backed editor for writers, Google sign-in for organizers, comments | M3 has been stable for a semester |

Reconsider the Django decision (D-019) if the team finds two codebases too heavy after the first handover.

---

## Sequencing rules
- M0 blocks everything: nobody should build features on a pipeline nobody has run.
- M1-BRAND-01 (name, tagline, "kyu QQuEST") blocks the Home, About and digest-card tasks, because they all use that wording.
- Do not skip the contributor dry run (M1-DOC-01): it is the only test of whether the club can publish without a developer.
- Real content (issues, projects, events, members) can start as soon as M0 closes; it does not wait for design polish.

## Anti-goals for the current stage

Things that will feel productive and are not, until M1 is complete:

- Building registration, check-in or sign-in before M3. The backend skeleton exists only so the pipeline is proven.
- Moving digest or event content into the Django admin. Content stays in Git (D-001).
- Writing 20 digest issues in advance. Write 3, run the workflow, learn what is painful.
- Animations, 3D quantum visuals, easter eggs. Content and continuity first.
- Setting up an email newsletter or a custom CMS.
- Redesigning the QFF 2026 site. It is a separate project with its own deadline.
- Adding a UI framework or component library.

If you find yourself doing one of these, check which milestone is active.
