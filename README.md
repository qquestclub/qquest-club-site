# QQuEST club website

The permanent home of the **QQuEST** quantum computing club at MIT-ADT University, Pune:
who we are, our events, our projects, and a weekly digest of what happened in quantum.

- **Website** (this folder's root): Next.js. Pages are built from Markdown files in `content/`.
- **API** (`backend/`): Django REST Framework. Event capacity, registration and check-in
  (a skeleton for now). The website's content pages do **not** depend on it.
- **Spec** (`spec/`): the plan. Start with `spec/requirements.md`.

## Where do I start?

| I want to... | Read |
|---|---|
| Understand what we are building | `spec/requirements.md` (short), then `BRIEF.md` |
| Publish a digest issue, event or project | `docs/CONTRIBUTING.md` (no coding needed) |
| Work on the website code | this file, then `AGENTS.md` and `CONTRACT.md` |
| Work on the API | `backend/README.md` |
| Pick a task | `spec/tasks.md` (take one, do one, one commit) |
| Know why something is the way it is | `spec/decisions.md` |
| Hand the project to the next team | `docs/HANDOVER.md` |

## Run the website locally

Needs Node.js 22 (`.nvmrc`).

```bash
npm install            # the first time (commit the generated package-lock.json: task M0-REPO-01)
npm run dev            # http://localhost:3000
```

Content is validated when the site loads. If a Markdown file is wrong, the error names the
file and the field.

## Check everything before you push

```bash
npm run verify
```

That runs the spec checks, the type check, the website tests, the API tests and a production
build. The API tests need Python 3.12+ and `pip install -r backend/requirements.txt` once
(use a virtual environment; see `backend/README.md`).

## Layout

```
content/     everything editable: digest, events, projects, members, pages
src/         website code (app/ = pages, components/, lib/ = tested logic)
tests/       website tests, each named with its eval ID
backend/     Django API
spec/        requirements, plan, tasks, decisions, evals, smoke checklist
docs/        contributor guide, handover checklist
scripts/     the spec checks that run on every commit and in CI
```

## The four rules that matter most

1. **No money.** Everything runs on free plans. A new service needs a decision first (`INV-1`).
2. **The content pages must work with the API switched off** (`INV-2`).
3. **Every digest claim has a source** (`INV-3`).
4. **Every event time ends in `+05:30`** (`INV-4`).

Full list: `CONTRACT.md`. The `spec/` folder follows spec-driven development: the spec carries
the reasoning, tests enforce it, and `AGENT_LOG.md` records what happened session to session, so
a new person or a coding assistant can pick up where the last one stopped.
