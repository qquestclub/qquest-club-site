import { notFound } from "next/navigation";
import { getPage } from "@/lib/content/load";
import { Prose } from "./Prose";

/** A free-form page from content/pages/<slug>.md, such as About or Join. */
export function ContentPage({ slug }: { slug: string }) {
  const page = getPage(slug);
  if (!page) notFound();
  return (
    <article className="container narrow">
      <h1>{page.title}</h1>
      <p className="lede">{page.description}</p>
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
