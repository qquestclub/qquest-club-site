import { getContent } from "@/lib/content/load";
import { buildRss } from "@/lib/rss";
import { site } from "@/lib/site";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export function GET() {
  const items = getContent()
    .digest.filter((issue) => !issue.draft)
    .map((issue) => ({
      title: issue.title,
      slug: issue.slug,
      date: issue.date,
      summary: issue.summary,
      tags: issue.tags,
    }));
  const xml = buildRss(
    { title: site.digestName, description: site.digestDescription, siteUrl: getSiteUrl() },
    items,
  );
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
