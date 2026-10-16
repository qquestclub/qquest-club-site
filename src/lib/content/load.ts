// Reads, validates and cross-checks everything in content/.
//
// Rule (CONTRACT "never do this"): a bad content file FAILS the build, naming the file
// and the field. It is never skipped silently.

import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import type { ZodTypeAny, z } from "zod";
import { isProduction } from "../env";
import {
  SLUG_PATTERN,
  digestSchema,
  eventSchema,
  memberSchema,
  pageSchema,
  projectSchema,
  type Digest,
  type Entry,
  type EventItem,
  type Member,
  type Page,
  type Project,
} from "./schema";

export class ContentError extends Error {
  readonly problems: string[];
  constructor(problems: string[]) {
    super(`Content has ${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
    this.name = "ContentError";
    this.problems = problems;
  }
}

export interface LoadOptions {
  /** Directory holding the collection folders. Defaults to ./content. */
  contentDir?: string;
  /** Include items marked `draft: true`. Defaults to true outside production. */
  includeDrafts?: boolean;
}

export interface Content {
  digest: Entry<Digest>[];
  events: Entry<EventItem>[];
  projects: Entry<Project>[];
  members: Entry<Member>[];
  pages: Entry<Page>[];
}

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** Splits "---\nyaml\n---\nbody". YAML is parsed with the core schema, so dates stay strings. */
export function splitFrontMatter(raw: string): { data: unknown; body: string } {
  const text = raw.replace(/^﻿/, "");
  const match = FRONT_MATTER.exec(text);
  if (!match) {
    throw new Error("file must start with a front-matter block between two --- lines");
  }
  let data: unknown;
  try {
    data = parseYaml(match[1]);
  } catch (error) {
    throw new Error(`front-matter is not valid YAML: ${(error as Error).message.split("\n")[0]}`);
  }
  return { data: data ?? {}, body: match[2].trim() };
}

function formatIssues(file: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const where = issue.path.length > 0 ? issue.path.join(".") : "(whole file)";
    return `${file}: ${where}: ${issue.message}`;
  });
}

function readCollection<S extends ZodTypeAny>(
  contentDir: string,
  folder: string,
  schema: S,
  problems: string[],
): Entry<z.output<S>>[] {
  const dir = path.join(contentDir, folder);
  if (!fs.existsSync(dir)) return [];

  const entries: Entry<z.output<S>>[] = [];
  const files = fs.readdirSync(dir).filter((name) => name.endsWith(".md")).sort();

  for (const name of files) {
    const label = `content/${folder}/${name}`;
    const slug = name.slice(0, -".md".length);

    if (!SLUG_PATTERN.test(slug)) {
      problems.push(`${label}: file name must be lowercase kebab-case, like my-file-name.md`);
      continue;
    }

    let split: { data: unknown; body: string };
    try {
      split = splitFrontMatter(fs.readFileSync(path.join(dir, name), "utf8"));
    } catch (error) {
      problems.push(`${label}: ${(error as Error).message}`);
      continue;
    }

    const parsed = schema.safeParse(split.data);
    if (!parsed.success) {
      problems.push(...formatIssues(label, parsed.error));
      continue;
    }
    entries.push({ ...(parsed.data as object), slug, body: split.body } as Entry<z.output<S>>);
  }
  return entries;
}

function isDraft(item: { draft?: boolean }): boolean {
  return item.draft === true;
}

/** Digest files are named issue-NNN-short-title.md, and NNN must equal the `issue` field. */
function checkDigestNames(digest: Entry<Digest>[], problems: string[]): void {
  const seen = new Map<number, string>();
  for (const item of digest) {
    const label = `content/digest/${item.slug}.md`;
    const match = /^issue-(\d{3})-/.exec(item.slug);
    if (!match) {
      problems.push(`${label}: digest file names must look like issue-007-short-title.md`);
    } else if (Number(match[1]) !== item.issue) {
      problems.push(`${label}: file name says issue ${Number(match[1])} but the issue field says ${item.issue}`);
    }
    const earlier = seen.get(item.issue);
    if (earlier) {
      problems.push(`${label}: issue number ${item.issue} is already used by ${earlier}`);
    }
    seen.set(item.issue, label);
  }
}

/** Authors and team members must be real, non-draft members. */
function checkMemberReferences(
  members: Entry<Member>[],
  digest: Entry<Digest>[],
  projects: Entry<Project>[],
  problems: string[],
): void {
  const known = new Set(members.filter((m) => !isDraft(m)).map((m) => m.slug));
  for (const item of digest) {
    for (const author of item.authors) {
      if (!known.has(author)) {
        problems.push(`content/digest/${item.slug}.md: authors: no member file content/members/${author}.md`);
      }
    }
  }
  for (const project of projects) {
    for (const person of project.team) {
      if (!known.has(person)) {
        problems.push(`content/projects/${project.slug}.md: team: no member file content/members/${person}.md`);
      }
    }
  }
}

/** Loads and validates everything. Throws ContentError listing every problem found. */
export function loadAll(options: LoadOptions = {}): Content {
  const contentDir = options.contentDir ?? path.join(process.cwd(), "content");
  const includeDrafts = options.includeDrafts ?? !isProduction();
  const problems: string[] = [];

  const members = readCollection(contentDir, "members", memberSchema, problems);
  const digest = readCollection(contentDir, "digest", digestSchema, problems);
  const events = readCollection(contentDir, "events", eventSchema, problems);
  const projects = readCollection(contentDir, "projects", projectSchema, problems);
  const pages = readCollection(contentDir, "pages", pageSchema, problems);

  checkDigestNames(digest, problems);
  checkMemberReferences(members, digest, projects, problems);

  if (problems.length > 0) throw new ContentError(problems);

  const keep = <T extends { draft?: boolean }>(items: T[]): T[] =>
    includeDrafts ? items : items.filter((item) => !isDraft(item));

  return {
    members: keep(members).sort(
      (a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name),
    ),
    digest: keep(digest).sort((a, b) => b.issue - a.issue),
    events: keep(events).sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at)),
    projects: keep(projects).sort((a, b) => b.year - a.year || a.title.localeCompare(b.title)),
    pages, // pages have no `draft` field, so there is nothing to filter
  };
}

let cached: Content | undefined;

/** The site's content. Cached in production builds; re-read on every call in development. */
export function getContent(): Content {
  if (!isProduction()) return loadAll();
  cached ??= loadAll();
  return cached;
}

export function getPage(slug: string): Entry<Page> | undefined {
  return getContent().pages.find((page) => page.slug === slug);
}
