// Shared helpers for the content tests. Not a test file itself.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/** Writes files into a fresh temporary content directory and returns its path. */
export function makeContent(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qquest-content-"));
  for (const [relative, text] of Object.entries(files)) {
    const target = path.join(dir, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text, "utf8");
  }
  return dir;
}

export const MEMBER = `---
name: "Test Member"
role: "Tester"
---
`;

export function digestFile(overrides: Record<string, string> = {}): string {
  const fields: Record<string, string> = {
    title: '"A perfectly good test issue"',
    issue: "1",
    date: '"2026-10-13"',
    authors: "[test-member]",
    tags: "[education]",
    summary: '"A summary that is comfortably longer than twenty characters."',
    sources: '\n  - title: "A source"\n    url: "https://example.com/source"',
    ...overrides,
  };
  const lines = Object.entries(fields).map(([key, value]) => `${key}: ${value}`);
  return `---\n${lines.join("\n")}\n---\nBody text.\n`;
}

export function eventFile(overrides: Record<string, string> = {}): string {
  const fields: Record<string, string> = {
    title: '"A test event for the club"',
    starts_at: '"2026-11-03T09:30:00+05:30"',
    mode: "in-person",
    location: '"Pune"',
    summary: '"A summary that is comfortably longer than twenty characters."',
    ...overrides,
  };
  const lines = Object.entries(fields).map(([key, value]) => `${key}: ${value}`);
  return `---\n${lines.join("\n")}\n---\nBody text.\n`;
}
