import assert from "node:assert/strict";
import path from "node:path";
import { describe, test } from "node:test";
import { ContentError, loadAll } from "../src/lib/content/load";
import { MEMBER, digestFile, eventFile, makeContent } from "./helpers";

function problemsFor(files: Record<string, string>, includeDrafts = true): string[] {
  const dir = makeContent(files);
  try {
    loadAll({ contentDir: dir, includeDrafts });
  } catch (error) {
    assert.ok(error instanceof ContentError, `expected a ContentError, got ${String(error)}`);
    return error.problems;
  }
  return [];
}

const baseFiles = { "members/test-member.md": MEMBER };

describe("content: the committed site content", () => {
  test("G-06: the committed content/ directory loads and has every collection", () => {
    const content = loadAll({ contentDir: path.join(process.cwd(), "content"), includeDrafts: true });
    assert.ok(content.members.length >= 1, "at least one member");
    assert.ok(content.digest.length >= 1, "at least one digest issue");
    assert.ok(content.events.length >= 1, "at least one event");
    assert.ok(content.projects.length >= 1, "at least one project");
    const pageSlugs = content.pages.map((page) => page.slug);
    assert.ok(pageSlugs.includes("about"), "an about page");
    assert.ok(pageSlugs.includes("join"), "a join page");
  });

  test("INV-3-T: every committed non-draft digest issue has at least one source", () => {
    const content = loadAll({ contentDir: path.join(process.cwd(), "content"), includeDrafts: false });
    for (const issue of content.digest) {
      assert.ok(issue.sources.length >= 1, `${issue.slug} has no sources`);
    }
  });
});

describe("content: valid files load", () => {
  test("G-06: a minimal valid digest issue and event load without problems", () => {
    const dir = makeContent({
      ...baseFiles,
      "digest/issue-001-test.md": digestFile(),
      "events/test-event.md": eventFile(),
    });
    const content = loadAll({ contentDir: dir, includeDrafts: true });
    assert.equal(content.digest[0].issue, 1);
    assert.equal(content.digest[0].date, "2026-10-13", "a quoted date stays a plain string");
    assert.equal(content.events[0].starts_at, "2026-11-03T09:30:00+05:30");
  });
});

describe("content: bad files fail loudly", () => {
  test("INV-3-T: a digest issue with no sources is rejected", () => {
    const problems = problemsFor({
      ...baseFiles,
      "digest/issue-001-test.md": digestFile({ sources: "[]" }),
    });
    assert.ok(problems.some((p) => p.includes("content/digest/issue-001-test.md") && p.includes("sources")), problems.join("\n"));
  });

  test("INV-4-T: an event time without a UTC offset is rejected", () => {
    const problems = problemsFor({
      "events/test-event.md": eventFile({ starts_at: '"2026-11-03T09:30:00"' }),
    });
    assert.ok(problems.some((p) => p.includes("starts_at") && p.includes("offset")), problems.join("\n"));
  });

  test("INV-4-T: an event time with an offset is accepted, and so is Z", () => {
    assert.deepEqual(problemsFor({ "events/a-event.md": eventFile({ starts_at: '"2026-11-03T09:30:00+05:30"' }) }), []);
    assert.deepEqual(problemsFor({ "events/b-event.md": eventFile({ starts_at: '"2026-11-03T04:00:00Z"' }) }), []);
  });

  test("INV-4-T: an unquoted YAML timestamp is still caught, not silently converted", () => {
    const problems = problemsFor({
      "events/test-event.md": eventFile({ starts_at: "2026-11-03T09:30:00" }),
    });
    assert.ok(problems.some((p) => p.includes("starts_at")), problems.join("\n"));
  });

  test("N-01: an author with no member file is rejected, naming the file and the slug", () => {
    const problems = problemsFor({
      ...baseFiles,
      "digest/issue-001-test.md": digestFile({ authors: "[ghost-writer]" }),
    });
    assert.ok(
      problems.some((p) => p.includes("content/digest/issue-001-test.md") && p.includes("ghost-writer")),
      problems.join("\n"),
    );
  });

  test("N-01: a project team member with no member file is rejected", () => {
    const project = `---
title: "A test project"
summary: "A summary that is comfortably longer than twenty characters."
tags: [qiskit]
status: ongoing
year: 2026
team: [nobody-here]
---
`;
    const problems = problemsFor({ ...baseFiles, "projects/test-project.md": project });
    assert.ok(problems.some((p) => p.includes("nobody-here")), problems.join("\n"));
  });

  test("N-02: an unknown front-matter key (a typo) is rejected", () => {
    const problems = problemsFor({
      "events/test-event.md": eventFile({ start_at: '"2026-11-03T09:30:00+05:30"' }),
    });
    assert.ok(problems.some((p) => p.includes("start_at") || p.includes("Unrecognized")), problems.join("\n"));
  });

  test("N-03: two issues with the same number are rejected", () => {
    const problems = problemsFor({
      ...baseFiles,
      "digest/issue-001-first.md": digestFile(),
      "digest/issue-001-second.md": digestFile(),
    });
    assert.ok(problems.some((p) => p.includes("already used")), problems.join("\n"));
  });

  test("N-06: a file name that is not lowercase kebab-case is rejected", () => {
    const problems = problemsFor({ "members/Bad Name.md": MEMBER });
    assert.ok(problems.some((p) => p.includes("Bad Name.md") && p.includes("kebab-case")), problems.join("\n"));
  });

  test("N-06: a digest file whose number does not match its issue field is rejected", () => {
    const problems = problemsFor({
      ...baseFiles,
      "digest/issue-005-wrong.md": digestFile({ issue: "6" }),
    });
    assert.ok(problems.some((p) => p.includes("issue 5") && p.includes("issue field says 6")), problems.join("\n"));
  });

  test("N-06: a digest file not named issue-NNN-... is rejected", () => {
    const problems = problemsFor({ ...baseFiles, "digest/my-post.md": digestFile() });
    assert.ok(problems.some((p) => p.includes("issue-007-short-title")), problems.join("\n"));
  });

  test("N-07: an http:// registration link is rejected", () => {
    const problems = problemsFor({
      "events/test-event.md": eventFile({ registration_url: '"http://example.com/form"' }),
    });
    assert.ok(problems.some((p) => p.includes("registration_url") && p.includes("https")), problems.join("\n"));
  });

  test("N-07: an http:// source link is rejected", () => {
    const problems = problemsFor({
      ...baseFiles,
      "digest/issue-001-test.md": digestFile({
        sources: '\n  - title: "Insecure"\n    url: "http://example.com/a"',
      }),
    });
    assert.ok(problems.some((p) => p.includes("https")), problems.join("\n"));
  });

  test("N-02: a file with no front-matter block is rejected with a clear message", () => {
    const problems = problemsFor({ "members/test-member.md": "Just some text, no front-matter.\n" });
    assert.ok(problems.some((p) => p.includes("front-matter")), problems.join("\n"));
  });

  test("N-02: every problem is reported at once, not only the first", () => {
    const problems = problemsFor({
      "events/one-event.md": eventFile({ start_at: '"2026-11-03T09:30:00+05:30"' }),
      "events/two-event.md": eventFile({ starts_at: '"2026-11-03T09:30:00"' }),
    });
    assert.ok(problems.length >= 2, problems.join("\n"));
  });
});

describe("content: drafts", () => {
  const files = {
    ...baseFiles,
    "digest/issue-001-live.md": digestFile(),
    "digest/issue-002-secret.md": digestFile({ issue: "2", draft: "true" }),
  };

  test("N-05: drafts are excluded when drafts are not included", () => {
    const content = loadAll({ contentDir: makeContent(files), includeDrafts: false });
    assert.deepEqual(content.digest.map((d) => d.issue), [1]);
  });

  test("N-05: drafts are present when drafts are included, newest issue first", () => {
    const content = loadAll({ contentDir: makeContent(files), includeDrafts: true });
    assert.deepEqual(content.digest.map((d) => d.issue), [2, 1]);
  });

  test("N-05: a draft is still validated, so a broken draft fails the build", () => {
    const problems = problemsFor(
      { ...baseFiles, "digest/issue-001-draft.md": digestFile({ draft: "true", sources: "[]" }) },
      false,
    );
    assert.ok(problems.length > 0);
  });
});
