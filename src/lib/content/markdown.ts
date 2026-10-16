import { marked } from "marked";

/**
 * Turns Markdown into HTML.
 *
 * This does NOT sanitize. It is only safe for content that was reviewed in a pull
 * request. Never pass user-submitted text through it (CONTRACT "never do this").
 */
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false, gfm: true }) as string;
}
