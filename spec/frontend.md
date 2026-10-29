# frontend.md — Pages, sections and look

*For the people building the website (Next.js, root of the repo). It says which pages exist, what each section shows, where its data comes from, and which milestone delivers it. Requirements are in `requirements.md`, data shapes in `architecture.md` and `docs/database/README.md`, the reasons in `decisions.md`. Where this file and `CONTRACT.md` disagree, the contract wins.*

The visual mockup is a Claude Design canvas titled "QQuEST Club Site Mockup": Option A in dark and light (landing, digest, event with registration, organizer check-in), plus Options B and C for the landing page. When the team agrees on it, export the screens as images into `docs/design/` and link them here. Text in [BRACKETS] in the mockup is a decision the team still owes, not final copy.

---

## 1. The three main sections, plus what surrounds them

| Section | What it is | Data source | Milestone |
|---|---|---|---|
| Landing page | The club's front door: identity, what is on now, the way in | Markdown in `content/` | M1 |
| Blog (the digest) | Weekly quantum news with sources; archive, issues, tags, RSS | Markdown in `content/digest/` | M1 |
| Event management | Events list and detail now; registration, QR ticket and organizer check-in later | Markdown for the event text, the Django API for seats and registrations | Events M1, registration and check-in M3 |
| Projects | Showcase of what the club has built, with the team credited | Markdown in `content/projects/` | M1 |
| Team | Member cards, linked from digest authors and project teams | Markdown in `content/members/` | M1 |
| About, Join | Who we are and how to join (Join links to an external form in v1) | Markdown in `content/pages/` | M1 |

## 2. Page inventory

Routes marked "built" exist in the repo today and render sample content.

| Route | Purpose | Sections, in order | Status |
|---|---|---|---|
| `/` | Landing | Header · hero ("kyu QQuEST?") · now (next event, latest issue) · three latest issues · three projects · about and team teaser · join band · footer | built, M1-HOME-01 finishes it |
| `/digest` | Archive | Title and one-line promise · follow links (RSS, Instagram, LinkedIn) · tag filter · latest issue (large) · issue list | built; tag filter M1-DIG-01 |
| `/digest/[slug]` | One issue | Issue number and date · title · authors and tags · body · Sources list · previous and next | built |
| `/digest/tag/[tag]` | Issues for one tag | Same as the archive, filtered | M1-DIG-01 |
| `/events` | Events | Upcoming (soonest first) · past (latest first) | built |
| `/events/[slug]` | One event | Title, time in IST, venue, mode · poster · description · speakers and sessions · registration card (see section 4) | built without the card |
| `/projects`, `/projects/[slug]` | Showcase | Cards with status and year · detail with team, repo and demo links | built |
| `/team` | People | Active members first, then alumni | built |
| `/about`, `/join` | Free pages | Markdown body · call-to-action button on Join | built, real text M1-ABT-01 and M1-JOIN-01 |
| `/feed.xml`, `/sitemap.xml`, `/robots.txt` | Machine pages | — | built |
| `/organizer` (name to be confirmed) | Check-in for staff | See section 4.2 | M3, needs a change proposal |
| 404 | Not found | Friendly message and a link home | built |

Later and not scheduled: search (M2-SRCH-01), add-to-calendar (M2-EVT-01), event recaps (M2-EVT-02), Resources (M2-RES-01), achievements (M2-ACH-01), newsletter sign-up (needs the email decision first).

## 3. Landing page and blog: what each section must do

**Landing**
- Hero: the headline "kyu QQuEST?" with the club's one-sentence meaning (a decision owed, M1-BRAND-01), two buttons: Read the digest, See events.
- Now: two cards. The next upcoming event (title, date in IST, venue, link). If none exists, a friendly line such as "No event scheduled; check the digest", never an empty box (R-005). The latest non-draft issue (number, title, summary, date).
- Latest issues, projects, team teaser and a join band. All lists are the newest few items from Markdown.
- This page may not call the API (INV-2).

**Blog**
- Archive and issue pages as in the table above. An issue always shows its Sources (INV-3), the date as `13 Oct 2026`, and authors linked to the Team page.
- Tags come only from the fixed list in `src/lib/content/tags.ts`.
- Follow links: RSS, Instagram, LinkedIn. There is no email box until the newsletter is built (CONTRACT: never fake a capability).
- Each issue also gets a 1200 x 630 share image (M1-DIG-02) and a 1080 x 1350 Instagram card (M1-DIG-03).

## 4. Event management

### 4.1 Attendee side, on `/events/[slug]` (M3)

- Event text is from the Markdown file. The registration card is separate and comes from the API, joined by the same slug.
- The card shows seats left, the deadline in IST, and a form: name, email, college, degree, branch, year of study, and a consent checkbox that must be ticked. The consent timestamp is stored.
- After submit, exactly one of: Confirmed (QR ticket shown, also emailed, cancel link), Waitlisted (clear wording that order of joining decides), Closed, or Already registered. Plain sentences, never a raw error code.
- Cold start: the free API sleeps and can take about a minute to wake. On page load the browser calls `/api/health/` to warm it. While waiting, show "warming up" and keep retrying. If it never answers, say so and offer the external form link as a fallback.
- Only this card may call the API, from the browser after the page has loaded (INV-2). The event page itself must render fully with the API off. In v1 the Register button simply opens `registration_url`.

### 4.2 Organizer side (M3)

- First version: Django's built-in admin, with an action to export a CSV. This needs no custom frontend.
- Custom check-in page (later in M3): staff sign-in, a counter of checked-in against capacity, Scan QR and Search name modes, a result card (checked in, or already checked in with who and when), Undo, recent list, and a CSV download as the offline backup. It is a phone-sized screen.
- A camera scanner needs client-side code, which the contract currently allows only for the registration form (INV-2). Building it needs a maintainer-approved change to `CONTRACT.md` first.

## 5. The look

The mockup canvas shows three directions. The team picks one; the rest of this section describes Option A, which has both a dark and a light theme designed.

| Option | Feel | Themes drawn |
|---|---|---|
| A: quantum plus chai | Night-sky ground, glowing cyan and violet "qubit" accents, one warm chai accent. Section labels written as kets, for example `|digest⟩` | Dark and light, all four screens (landing, digest, event with registration, organizer check-in) |
| B: Chai Stall | Warm cream, thick ink outlines, hard offset shadows, big serif headline, poster energy | Light only, landing page |
| C: Aurora | Near-black with soft colour glow, glass cards, gradient headline | Dark only, landing page |

If B or C is chosen, the remaining screens are designed in that style before M1-BRAND-02 starts. All three differ from the Qiskit Fall Fest site on purpose, so the club has its own identity.

### Option A tokens

| Token | Dark | Light | Use |
|---|---|---|---|
| Ground | `#0A0F1F` | `#F8F6FF` | Page background |
| Raised ground | `#0D1428` | `#FFFFFF` | Alternate bands (states, issue reading page) |
| Surface | `#121A33` | `#FFFFFF` | Cards |
| Surface 2 | `#1A2444` | `#EDE8FF` | Chips, segmented controls |
| Line | `#2A3560` | `#DAD3F0` | Borders |
| Text | `#EAF0FF` | `#14112B` | Main text |
| Muted | `#A3AED0` | `#55507A` | Secondary text (at least 7:1 on the ground in both themes) |
| Chai button | `#F4A93B` with `#1A1203` text | same | Primary buttons, both themes |
| Chai text | `#F4A93B` | `#A85A00` | Small labels (the light value passes 4.5:1 on white) |
| Cyan (links, kets) | `#5CE1E6` | `#0B7C84` | Links and ket labels; the light value is darker so it passes contrast |
| Violet | `#9B8CFF` | `#5B45D6` | Second accent, focus ring in the light theme |

- Type: Space Grotesk for headings, DM Sans for body, IBM Plex Mono for kets and technical labels. If load time suffers, fall back to system fonts first and keep the headings.
- Shape: rounded cards (16 to 28 px), pill buttons, generous spacing.
- Interaction: cards lift slightly on hover, a visible focus ring on every link and button, and reduced-motion turns the lift off.
- Logo: two overlapping rings, chai and violet (a placeholder until M1-BRAND-02).

### Theme switching

- Both themes ship together. The header has a Light or Dark button that shows the theme you would switch to.
- First visit follows the visitor's system setting (`prefers-color-scheme`). The choice is then remembered in the browser. If storage is unavailable, the page still renders correctly in the system theme.
- Implementation: colours are CSS variables in `src/app/globals.css` (D-014), with the light values as the default and the dark values under `prefers-color-scheme: dark` and a `data-theme` attribute for the manual choice. The toggle is the only client-side script on content pages, so it needs a small decision in `decisions.md` before M2-THEME-01 starts (it touches the "no client components" rule in AGENTS.md). Without the toggle the system setting alone still works with no script.
- The current stylesheet has a different chai-on-cream palette; M1-BRAND-02 replaces its variables with the tokens above.

## 6. Rules for every page

- Server-rendered. No client component unless a task justifies it (AGENTS.md).
- Mobile first. No horizontal scroll at 360 px. Touch targets at least 44 px.
- Accessibility: keyboard reachable, visible focus, alt text, text contrast at least 4.5:1, reduced-motion respected (R-036).
- Performance: mobile Lighthouse performance and accessibility at least 90 (R-035). Decorative graphics are inline SVG, not large images.
- Times always through `formatEventDate` and shown as IST (INV-4). No hard-coded domains (INV-5).
- No placeholder behaviour: a button either works or is not on the page.

## 7. Decisions still owed by the team

| Question | Needed by |
|---|---|
| The one-sentence meaning of "kyu QQuEST", the tagline and the digest name | M1-BRAND-01 |
| Which option (A, B or C) the club picks, and whether light, dark or both ship first | M1-BRAND-02 |
| Who may see the organizer page, and what its route is called | M3 change proposal |
| Whether the camera scanner justifies an INV-2 change, or the admin plus CSV is enough for the first event | M3 change proposal |
| Retention period for registrant data | M3 change proposal |
