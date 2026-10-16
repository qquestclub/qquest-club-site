import type { Entry, Page } from "@/lib/content/schema";
import { Prose } from "./Prose";

export function PageView({ page }: { page: Entry<Page> }) {
  return (
    <article>
      <h1>{page.title}</h1>
      <p className="lead">{page.description}</p>
      <Prose markdown={page.body} />
      {page.cta_label && page.cta_url ? (
        <p>
          <a className="button" href={page.cta_url}>
            {page.cta_label}
          </a>
        </p>
      ) : null}
    </article>
  );
}
