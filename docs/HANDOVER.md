# Handover checklist

Websites for student clubs usually die when the person who set them up graduates. This file
exists so that does not happen. **Fill it in during task M0-OWN-01, and repeat it every year.**

## Who owns what

Accounts must belong to the club (a shared club mailbox), not to one student's personal login.
At least two people must be able to get in to each one.

| Thing | Owned by (account) | Admin 1 | Admin 2 | Recovery path |
|---|---|---|---|---|
| GitHub organisation `qquestclub` | | | | |
| Vercel (website hosting) | | | | |
| Render (API hosting) | | | | |
| Neon (database) | | | | |
| Clerk (sign-in, from M3) | | | | |
| Domain name (if any) | | | | |
| Club mailbox (`qquest@mitadt.edu.in`?) | | | | |

## Yearly handover (do it before exams)

- [ ] Add the new leads as admins on every row above, **then** remove people who have left.
- [ ] Confirm the new leads can log in to each service themselves.
- [ ] Update this table.
- [ ] Walk the new website lead through `README.md` and `AGENTS.md`.
- [ ] Walk the new digest editor through `docs/CONTRIBUTING.md` and have them publish one issue.
- [ ] Run the free-tier check below.

## Free-tier check (every semester)

Free plans change. Open each page, write down what you find, and compare with `spec/decisions.md`.
If a limit shrank or a card is now needed, write a decision entry before anything breaks.

| Service | What to check | Last checked | Result |
|---|---|---|---|
| Vercel Hobby | Still free? Still allowed for a club site? Usage near any cap? | | |
| Render free web service | Still free? Sleep time? Bandwidth cap? | | |
| Neon free | Storage and compute-hour limits unchanged? Database still awake on demand? | | |
| Clerk | Free user limit unchanged? | | |
| GitHub Actions | Free minutes enough for CI? | | |

Last known figures (checked October 2026, from vendor pages and write-ups, so verify):
Vercel Hobby is for personal non-commercial use and pauses the site at its limits. Render's free
web service sleeps after 15 minutes idle (about a minute to wake) and its free database expires
after 30 days, which is why we use Neon. Neon free gives 0.5 GB per project and 100 compute-hours a
month, with scale to zero. Clerk free covers 50,000 monthly retained users.
