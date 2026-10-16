// Builds the RSS 2.0 feed for the digest. Pure function: no files, no clock, so the
// output is exactly reproducible (golden test G-04).

export const RSS_ITEM_LIMIT = 20;

export interface FeedMeta {
  title: string;
  description: string;
  /** The site address with no trailing slash, from getSiteUrl(). */
  siteUrl: string;
}

export interface FeedItem {
  title: string;
  slug: string;
  /** YYYY-MM-DD */
  date: string;
  summary: string;
  tags: string[];
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function pubDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export function buildRss(meta: FeedMeta, items: FeedItem[], limit: number = RSS_ITEM_LIMIT): string {
  const sorted = [...items].sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1)).slice(0, limit);

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(meta.title)}</title>`,
    `<link>${escapeXml(meta.siteUrl)}</link>`,
    `<description>${escapeXml(meta.description)}</description>`,
    "<language>en-IN</language>",
    `<atom:link href="${escapeXml(meta.siteUrl)}/feed.xml" rel="self" type="application/rss+xml"/>`,
  ];

  if (sorted.length > 0) {
    lines.push(`<lastBuildDate>${pubDate(sorted[0].date)}</lastBuildDate>`);
  }

  for (const item of sorted) {
    const url = `${meta.siteUrl}/digest/${item.slug}`;
    lines.push(
      "<item>",
      `<title>${escapeXml(item.title)}</title>`,
      `<link>${escapeXml(url)}</link>`,
      `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `<pubDate>${pubDate(item.date)}</pubDate>`,
      `<description>${escapeXml(item.summary)}</description>`,
      ...item.tags.map((tag) => `<category>${escapeXml(tag)}</category>`),
      "</item>",
    );
  }

  lines.push("</channel>", "</rss>");
  return `${lines.join("\n")}\n`;
}
