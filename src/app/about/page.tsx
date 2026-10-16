import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/PageView";
import { getPage } from "@/lib/content/load";

export function generateMetadata(): Metadata {
  const page = getPage("about");
  return page ? { title: page.title, description: page.description } : {};
}

export default function AboutPage() {
  const page = getPage("about");
  if (!page) notFound();
  return <PageView page={page} />;
}
