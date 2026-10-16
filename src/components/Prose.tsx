import { renderMarkdown } from "@/lib/content/markdown";

/** Renders reviewed Markdown. Never pass user-submitted text here (see CONTRACT.md). */
export function Prose({ markdown }: { markdown: string }) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />;
}
