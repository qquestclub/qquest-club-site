# smoke.md — Manual Smoke Checklist

Run before every deploy to production. About 10 minutes. Catches what automated tests do not.

```
npm run verify   # includes the Django tests
```

## 1. Build and config
- [ ] `npm run verify` finishes with zero errors
- [ ] No file named `.env` is tracked: `git ls-files | grep -E "^\.env"` shows only `.env.example`
- [ ] The build output mentions every expected route (home, digest, events, projects, team, about, join, feed.xml, sitemap.xml, robots.txt)

## 2. Cold start
Private window, no cache.
- [ ] Home loads with no console errors
- [ ] Each header link opens a page that is not the 404 page
- [ ] A made-up URL such as `/nope` shows the 404 page with a link home
- [ ] Hard refresh on a digest issue still works

## 3. Core path
- [ ] Home shows the latest issue and, when one exists, the next event
- [ ] Open the latest issue: title, issue number, date, authors, tags, body and a Sources list all show
- [ ] Open an upcoming event: the time reads like `3 Nov 2026, 9:30 AM IST`, and the Register button opens the real form
- [ ] Open a project: the team names link to the Team page
- [ ] `/feed.xml` opens as XML and lists the latest issue

## 4. Cross-device
- [ ] Desktop Chrome
- [ ] One non-Chromium browser
- [ ] Mobile phone: no horizontal scroll, links easy to tap
- [ ] 360 px viewport in the browser's device mode

## 5. Accessibility
- [ ] Tab through Home, an issue page and an event page using only the keyboard
- [ ] Focus is always visible
- [ ] Every image has alt text or is marked decorative
- [ ] Switch the system to dark mode: text stays readable
- [ ] With reduced-motion turned on, nothing animates

## 6. API (when the backend is deployed)
Run after any backend change. The first request after idle can take about a minute on Render's free plan; that is expected (D-021).
- [ ] `/api/health/` returns `{"status":"ok"}`
- [ ] `/api/health/db/` returns 200 (503 means Neon is unreachable or paused: check the Neon dashboard)
- [ ] `/api/events/` lists only non-draft events; no name, email or token appears anywhere in the response
- [ ] `/api/registrations/` and `/admin/` do not show data to an anonymous visitor (login page or 401/403/404)
- [ ] Response times in IST: an event shows `+05:30`
- [ ] The Render service has the three environment variables set (names only in the repo)
- [ ] Content pages still load with the API stopped (INV-2): pause the Render service once and reload the home page

## 7. Post-deploy
- [ ] The live URL serves the new build (check a string you just changed)
- [ ] View source of the live home page: canonical and share-preview URLs use the production domain, and the word `localhost` does not appear
- [ ] `/sitemap.xml` and `/robots.txt` open and list the production domain
- [ ] An upcoming event that has already passed does not show as upcoming (wait for the hourly refresh, or redeploy)

---

## Failure protocol
1. **Roll back first.** In the Vercel dashboard, open Deployments, pick the last good one and use Instant Rollback (or promote it). Do this before diagnosing.
2. Reproduce locally with `npm run build && npm start`.
3. Add a test to `evals.md` that would have caught it.
4. Fix, then re-run this checklist in full, not just the failed section.

Every production bug adds an item to this file.
