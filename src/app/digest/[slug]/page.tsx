import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TagList } from "@/components/Cards";
import { Prose } from "@/components/Prose";
import { getContent } from "@/lib/content/load";
import { TAG_LABELS } from "@/lib/content/tags";
import { formatDate } from "@/lib/dates";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getContent().digest.map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const issue = getContent().digest.find((item) => item.slug === slug);
  if (!issue) return {};
  return {
    title: issue.title,
    description: issue.summary,
    alternates: { canonical: `/digest/${slug}` },
    openGraph: { type: "article", publishedTime: issue.date },
  };
}

export default async function IssuePage({ params }: Props) {
  const { slug } = await params;
  const content = getContent();
  const issue = content.digest.find((item) => item.slug === slug);
  if (!issue) notFound();

  const authors = issue.authors.map((authorSlug) => content.members.find((member) => member.slug === authorSlug));

  return (
    <article>
      <p className="meta">
        Issue {issue.issue} · {formatDate(issue.date)}
      </p>
      <h1>{issue.title}</h1>
      <p className="lead">{issue.summary}</p>
      <p className="meta">
        By{" "}
        {authors.map((author, index) => (
          <span key={issue.authors[index]}>
            {index > 0 ? ", " : ""}
            {author ? <Link href={`/team#${author.slug}`}>{author.name}</Link> : issue.authors[index]}
          </span>
        ))}
      </p>
      <TagList tags={issue.tags.map((tag) => TAG_LABELS[tag])} />
      <Prose markdown={issue.body} />
      <section aria-labelledby="sources">
        <h2 id="sources">Sources</h2>
        <ol>
          {issue.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} rel="noopener noreferrer">
                {source.title}
              </a>
            </li>
          ))}
        </ol>
      </section>
      <p>
        <Link href="/digest">← All issues</Link>
      </p>
    </article>
  );
}
