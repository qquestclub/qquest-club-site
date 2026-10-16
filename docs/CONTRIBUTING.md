# How to add content (no coding needed)

Everything on the website that people read lives in the `content/` folder as plain text
files. You can add or change them **entirely in the GitHub website**, with no software
installed. Every change goes through a pull request, so a second member checks it before it
goes live. That second pair of eyes matters most for the digest.

## Publish a digest issue

1. Open the repository on GitHub and go to the `content/digest` folder.
2. Open the previous issue and copy its text (use the file's "Copy raw file" button).
3. Click **Add file → Create new file**. Name it like this, with a zero-padded number:
   `issue-007-short-title.md`  (lowercase, words joined by hyphens).
4. Paste the text, then change the top block and write your issue below it.
5. At the bottom choose **Create a new branch for this commit and start a pull request**.
6. Ask a second member to review it. They must open **every source link** and check that
   each claim in your issue is actually in that source. If not, cut the claim.
7. When the review passes and the green check appears, **Merge** the pull request.
   The site updates by itself in a few minutes.

### The top block (front-matter)

```
---
title: "Error correction in plain English"
issue: 7
date: "2026-10-27"
authors: [your-member-file-name]
tags: [error-correction, education]
summary: "One or two sentences that appear on the cards and in search results."
sources:
  - title: "Name of the paper or article"
    url: "https://example.com/the-source"
---
```

Rules that the checker enforces (if you break one, the green check turns red and tells you
which file and field):

- **Keep the quotation marks** around titles, dates and links.
- `issue` must match the number in the file name.
- `authors` must be the file name of a member in `content/members/`, without `.md`.
- `tags` come from this list only: hardware, algorithms, error-correction, industry, india,
  policy, education, research.
- **At least one source**, and every link must start with `https://`.
- **No claim without a source.** If you cannot link it, cut it.

Set `draft: true` in the top block to save an unfinished issue without publishing it.

## Add an event

Copy `content/events/qff-2026.md` to a new file in the same folder and edit it. The most
common mistake is the time. **Always write the +05:30**, like this: `"2026-11-03T09:30:00+05:30"`.
A time without it fails the check on purpose, because it would show up 5.5 hours wrong.

## Add a project or a member

Copy a file from `content/projects/` or `content/members/` and edit it. For a member, ask
the person first: only add a photo, GitHub or LinkedIn link they have agreed to. The repository
is public.

## Pictures

Compress images below 300 KB, put them in `public/images/`, and refer to them as
`/images/name.jpg`.

## When the check goes red

Click **Details** on the failed check. The message names the file and the field, for example
`content/events/qff-2026.md: starts_at: must be an ISO timestamp WITH a UTC offset`. Fix
that and commit again. Stuck? Ask in the club chat.
