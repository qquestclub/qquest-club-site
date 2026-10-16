import type { Metadata } from "next";

/** Per-page metadata. `path` is relative; the site address comes from metadataBase (INV-5). */
export function pageMetadata(input: { title: string; description: string; path: string }): Metadata {
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: { title: input.title, description: input.description, url: input.path, type: "website" },
  };
}
