# AGENT_LOG

Append-only. **Newest entry at the top.** Never edit past entries — append corrections as new entries.

Every session writes an entry, including failed sessions. "Noticed, did not fix" may not be empty without a reason.

---

## 2026-10-28 — ignore duplicate database diagram copies

**Milestone:** M0 (documentation maintenance)
**Tasks attempted:** User-requested cleanup of duplicate database diagram exports; no task from `spec/tasks.md` was attempted.
**Landed:** Added exact-path ignore rules for `docs/database/qquest-erd.png` and `docs/database/qquest-data-map.png`. Both files are byte-identical to the canonical `erd.png` and `data-map.png` exports.
**Did not land:** The duplicate files were not deleted, and no remote push was performed. No tests were run; only the Git diff and status were checked.
**Blockers:** none.
**Noticed, did not fix:** none.
**Spec changes:** none.
**Next action:** none.

---

## 2026-10-25 — Codex — database design documentation alignment

**Milestone:** M0 (documentation only)
**Tasks attempted:** User-requested database design documentation; no task from `spec/tasks.md` was attempted.
**Landed:** The `docs/database/` bundle was already present in the workspace. Reviewed its README, editable Mermaid sources, image exports, and model references; clarified that proposed public routes do not change INV-8 and that proposed public responses containing personal data need explicit contract and test approval. Added the architecture pointer and D-026.
**Did not land:** No backend or `CONTRACT.md` changes. No proposed M3 or later tables or routes were implemented. No tests were run; this was a documentation-only change.
**Blockers:** none.
**Noticed, did not fix:** `qquest-erd.png` and `qquest-data-map.png` are extra image copies not referenced by the README. They were left untouched because the requested relative links already use `erd.png` and `data-map.png`.
**Spec changes:** D-026 added; `spec/architecture.md` now points to `docs/database/README.md`. No task checkbox was changed.
**Next action:** M0-BE-02 (Render and Neon deploy), then prepare the M3 change proposal when event management begins.

---

## 2026-10-16 — Claude Sonnet 5.5 / Claude (chat with a file sandbox) — spec aligned to the Django decision

**Milestone:** M0 — Walking skeleton
**Tasks attempted:** spec alignment after the 2026-10-15 team meeting (Django REST Framework, Neon, Render). No M0 box is ticked.
**Landed:** CONTRACT INV-2 rewritten and INV-6 to INV-8 added with API conventions; decisions D-019 to D-025 added and D-003, D-004, D-006 marked superseded; requirements R-046 to R-058; tasks M0-BE-01/02 and M3; plan, architecture, evals, smoke, AGENTS, BRIEF updated. A backend (`backend/`, `render.yaml`) had already been scaffolded by an earlier session; this session checked it: `manage.py check` clean, `makemigrations --check` clean, 23 Django tests passing on SQLite. Also ran the website's 49 logic tests offline (all pass) and type-checked `src/lib` and `tests` (found and fixed one real type error in `src/lib/content/load.ts`; only the missing `next` package remains, as expected).
**Did not land:** `npm install`, `next build`, the `src/app/**` pages, `render.yaml` and CI were not run (npm registry blocked in the sandbox). Nothing deployed.
**Blockers:** none for the team; M0-REPO-01 and M0-BE-01 need a normal machine.
**Noticed, did not fix:** `src/components/ContentPage.tsx`, `Tags.tsx` and `src/lib/seo.ts` are unused leftovers (delete or use them in M0). The Cloudflare Workers plus Django ORM idea is unverified (M3-SPIKE-01). Vercel Hobby's fit for a club org repo is still open (M0-DEP-01). Whether Django admin should manage content (reverses D-001) is an open question for the team.
**Spec changes:** D-019 to D-025 added; D-003, D-004, D-006 superseded; INV-2 narrowed to "content pages work with the API off"; INV-6, INV-7, INV-8 added; R-046 to R-058 and M3 added. Approved by: the team's meeting decision as relayed by the user; CONTRACT edits still need a maintainer's explicit sign-off.
**Next action:** M0-REPO-01, then M0-BE-01, then M0-BE-02.

---

## 2026-10-13 — Claude Sonnet 5.5 / Claude (chat with a file sandbox) — M0 scaffold

**Milestone:** M0 — Walking skeleton
**Tasks attempted:** M0-CONT-01, M0-CONT-02, M0-TEST-01, M0-PAGE-01, M0-CI-01 (all scaffolded); spec system written.
**Landed:** the spec system and the code were generated. Checked in the sandbox: `python3 scripts/spec_lint.py --strict` and the pure-logic tests in `tests/` (see the result recorded below by the verification step).
**Did not land:** `npm install`, `next build` and the CI workflow were never run. The sandbox's network policy refused the npm registry (HTTP 403 from the egress gateway), so Next.js, React type definitions and the pages under `src/app/**` were not type-checked or built. No task box is ticked for that reason.
**Blockers:** none for the team; M0-REPO-01 needs a machine with npm access.
**Noticed, did not fix:** the `src/app/**` files follow Next.js 16 conventions from memory (async `params`, `generateStaticParams`, `MetadataRoute`) and may need small adjustments on first build. ESLint is not configured yet (M0-REPO-02). Versions in `package.json` are ranges and were not looked up on the registry; the lockfile will fix them.
**Spec changes:** none (initial).
**Next action:** M0-REPO-01 — run `npm install && npm run verify` on a normal machine, fix whatever the build reports one item at a time, commit `package-lock.json`, then log the result here.

---
