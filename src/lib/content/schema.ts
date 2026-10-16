// Schemas for every content collection. They are STRICT on purpose: an unknown key
// (usually a typo such as `start_at`) is an error, so a page cannot silently go blank.
// Rules come from CONTRACT.md. Keys are snake_case.

import { z } from "zod";
import { DIGEST_TAGS } from "./tags";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const TIMESTAMP_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/;

const slug = z.string().regex(SLUG_PATTERN, "must be lowercase kebab-case, like my-slug");

const httpsUrl = z
  .string()
  .url("must be a full URL")
  .refine((value) => value.startsWith("https://"), "must start with https://");

const imagePath = z.string().regex(/^\/images\/[A-Za-z0-9._/-]+$/, "must start with /images/");

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD (put it in quotes)")
  .refine((value) => {
    const [y, m, d] = value.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  }, "is not a real calendar date");

// INV-4: a time must say which timezone it is in.
export const isoTimestampWithOffset = z
  .string()
  .regex(
    TIMESTAMP_WITH_OFFSET,
    "must be an ISO timestamp WITH a UTC offset, like 2026-11-03T09:30:00+05:30 (put it in quotes)",
  )
  .refine((value) => !Number.isNaN(Date.parse(value)), "is not a real date and time");

const source = z
  .object({
    title: z.string().min(1, "needs a title"),
    url: httpsUrl,
  })
  .strict();

// INV-3: a published issue cites at least one source.
export const digestSchema = z
  .object({
    title: z.string().min(5).max(120),
    issue: z.number().int().positive(),
    date: isoDate,
    authors: z.array(slug).min(1, "needs at least one author (a member slug)"),
    tags: z.array(z.enum(DIGEST_TAGS)).min(1).max(4),
    summary: z.string().min(20).max(280),
    sources: z.array(source).min(1, "an issue needs at least one source (INV-3)"),
    cover: imagePath.optional(),
    draft: z.boolean().default(false),
  })
  .strict();

export const eventSchema = z
  .object({
    title: z.string().min(5).max(120),
    starts_at: isoTimestampWithOffset,
    ends_at: isoTimestampWithOffset.optional(),
    mode: z.enum(["in-person", "online", "hybrid"]),
    location: z.string().min(2).max(160),
    summary: z.string().min(20).max(280),
    registration_url: httpsUrl.optional(),
    microsite_url: httpsUrl.optional(),
    poster: imagePath.optional(),
    draft: z.boolean().default(false),
  })
  .strict()
  .refine((event) => !event.ends_at || Date.parse(event.ends_at) > Date.parse(event.starts_at), {
    message: "ends_at must be after starts_at",
    path: ["ends_at"],
  });

export const projectSchema = z
  .object({
    title: z.string().min(5).max(120),
    summary: z.string().min(20).max(280),
    tags: z.array(slug).min(1).max(6),
    status: z.enum(["ongoing", "completed", "paused"]),
    year: z.number().int().min(2020).max(2100),
    team: z.array(slug).min(1, "needs at least one team member (a member slug)"),
    repo_url: httpsUrl.optional(),
    demo_url: httpsUrl.optional(),
    writeup_url: httpsUrl.optional(),
    cover: imagePath.optional(),
    draft: z.boolean().default(false),
  })
  .strict();

export const memberSchema = z
  .object({
    name: z.string().min(2).max(80),
    role: z.string().min(2).max(80),
    batch: z.string().min(2).max(20).optional(),
    photo: imagePath.optional(),
    bio: z.string().max(400).optional(),
    github: httpsUrl.optional(),
    linkedin: httpsUrl.optional(),
    active: z.boolean().default(true),
    draft: z.boolean().default(false),
  })
  .strict();

export const pageSchema = z
  .object({
    title: z.string().min(2).max(80),
    description: z.string().min(10).max(200),
    cta_label: z.string().min(2).max(40).optional(),
    cta_url: httpsUrl.optional(),
  })
  .strict()
  .refine((page) => Boolean(page.cta_label) === Boolean(page.cta_url), {
    message: "cta_label and cta_url must be given together",
    path: ["cta_url"],
  });

export type Digest = z.infer<typeof digestSchema>;
export type EventItem = z.infer<typeof eventSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Member = z.infer<typeof memberSchema>;
export type Page = z.infer<typeof pageSchema>;

/** A parsed content file: its validated front-matter, plus its slug and Markdown body. */
export type Entry<T> = T & { slug: string; body: string };
