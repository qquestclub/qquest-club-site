# product.md — QQuEST Club Website

## 1. One-line definition
A permanent, free-to-run home for the QQuEST quantum computing club where anyone can see what we run, what we built, and read a weekly digest of quantum news written by members.

## 2. The problem
Club work disappears. Event pages are one-off microsites that expire, project write-ups live in chats and personal repos, and every graduating batch takes its knowledge with it. There is no single place that shows the club is alive, and no outlet that gives members public writing credit.

## 3. Target user
**Primary:** students at MIT-ADT University and nearby colleges who are curious about quantum computing and are deciding whether to join or attend.
**Secondary:** current members who publish, and outsiders (faculty, IBM/Qiskit community, sponsors) checking the club's credibility.
**Explicitly not the target:** quantum researchers wanting deep technical news, and anyone who needs a login-based product.

## 4. Core promise
> After visiting, a student can see what QQuEST does, read this week's quantum digest, find the next event, and know how to join.

Everything gets measured against that sentence.

## 5. Non-goals
- **A news site competing with professional quantum media.** The digest is a student-written, source-cited explainer, not breaking news.
- **A general member portal.** No accounts, forums or chat in v1; those need moderation and a backend we cannot maintain yet.
- **A replacement for event microsites.** Events with their own deadlines get their own site and are linked here.
- **A design showcase.** Identity matters, but content and continuity come first.

## 6. Success metrics
Ranked. Only the top one or two drive decisions.
1. Digest published on schedule in at least 80 percent of weeks each semester.
2. Number of different members who have authored an issue or a project page (spreads the workload, survives graduations).
3. Visitors who reach the Join page and click through to the form.

**Anti-metric — do not optimise:** raw page views. Chasing them pushes hype headlines about quantum, which damages the credibility the digest exists to build.

## 7. Kill criteria
If no digest issue is published for 8 consecutive weeks after launch, stop adding features and decide whether the cadence, the format or the team is the problem.

## 8. Glossary
- **Digest** — the weekly blog on what happened in quantum. Not an email newsletter; email is a later phase.
- **Issue** — one edition of the digest, numbered sequentially.
- **Content file** — a Markdown file in `content/` with front-matter; adding one adds a page.
- **Member slug** — a member's file name without `.md`, used to credit authors and project teams.
- **Microsite** — a separate site for one event, such as the Qiskit Fall Fest 2026 site.
- **Organizer** — a club member who runs an event; only relevant once the interactive layer exists.
