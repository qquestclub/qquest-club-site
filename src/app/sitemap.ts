import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content/load";
import { site } from "@/lib/site";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const content = getContent();
  const fixed = site.nav.map((item) => item.href);
  const paths = [
    ...fixed,
    ...content.digest.map((issue) => `/digest/${issue.slug}`),
    ...content.events.map((event) => `/events/${event.slug}`),
    ...content.projects.map((project) => `/projects/${project.slug}`),
  ];
  return paths.map((path) => ({ url: `${base}${path === "/" ? "" : path}` }));
}
