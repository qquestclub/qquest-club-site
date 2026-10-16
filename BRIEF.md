# BRIEF — QQuEST Club Website

*One page. Read in 3 minutes. Rewritten whenever state changes.*

**What this is:** the permanent home of the QQuEST quantum computing club, where a visitor can see what we run, read a weekly quantum digest, find the next event and join.

**Live at:** not deployed yet (task M0-DEP-01) · **Repo:** https://github.com/qquestclub (create the repo for this site there)

---

## Where things stand

**Milestone:** M0 — Walking skeleton (website and API)
**Exit criteria:** on a clean clone `npm ci && npm run verify` passes, CI is green, a Vercel URL serves every route, the Render API answers `/api/health/`, and owners are named.
**Progress:** scaffold generated; 0 of 11 M0 tasks verified. The Django API passed 23 tests in the sandbox. The Next.js app was written in an environment with no npm access, so it has never been installed or built.

**Team decision (2026-10-15):** Django REST Framework backend, Postgres on Neon, Render free hosting (D-019 to D-025). Content stays in Git.
**Last done:** specs aligned to the Django decision; backend scaffold verified.
**Next:** M0-REPO-01 (`npm install`, `npm run verify`, commit `package-lock.json`), then M0-BE-01 (run the API tests locally), then M0-BE-02 (first Render + Neon deploy).

---

## Prompt for the next session

Copy this into any coding agent:

```
Read AGENTS.md, then CONTRACT.md, then spec/plan.md and spec/tasks.md.
Then read the top 3 entries of AGENT_LOG.md.

Tell me which milestone is active and which task you propose next.
Do not write code yet.
```

---

## Three things most likely to break

1. `next build` has never run on this code: expect small fixes in `src/app/**` (Next.js 16 conventions) on the first attempt. Likewise `render.yaml` has never been deployed (D-021).
2. The free Render API sleeps after 15 minutes and takes about a minute to wake. Content pages must never depend on it (INV-2); only the registration form may call it.
3. Event times: a time written without `+05:30` fails the build on purpose (INV-4); fix the file, never the check.
4. Production URL: if `VERCEL_ENV` is production and the URL cannot be found, the build fails on purpose (INV-5); set `NEXT_PUBLIC_SITE_URL` in Vercel.

---

## Where everything is

| Need | File |
|---|---|
| What we are building, simply | `spec/requirements.md` |
| What must never break | `CONTRACT.md` |
| Rules for agents | `AGENTS.md` |
| What happened when | `AGENT_LOG.md` |
| What we're building and why | `spec/product.md` |
| Stack and structure | `spec/architecture.md` |
| Milestones | `spec/plan.md` |
| The backlog | `spec/tasks.md` |
| How correctness is proven | `spec/evals.md` |
| Pre-ship checklist | `spec/smoke.md` |
| Why things are the way they are | `spec/decisions.md` |
| Publishing content (non-developers) | `docs/CONTRIBUTING.md` |
| Yearly handover and free-tier watch | `docs/HANDOVER.md` |

---

## Standing rules

- Cost ceiling: ₹0 per month. No paid services, no payment methods without a recorded decision.
- Anti-metric (do not optimise): raw page views.
- Real metric: digest published on schedule in at least 80 percent of weeks.
- Do not build registration or check-in (M3) until its trigger in `spec/plan.md` fires. The API skeleton is there to prove the pipeline.
- Content never moves into the database or Django admin without a change proposal (D-001).
