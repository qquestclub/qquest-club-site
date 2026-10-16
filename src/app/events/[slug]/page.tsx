import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/Prose";
import { getContent } from "@/lib/content/load";
import { formatEventDate } from "@/lib/dates";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getContent().events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getContent().events.find((item) => item.slug === slug);
  if (!event) return {};
  return { title: event.title, description: event.summary, alternates: { canonical: `/events/${slug}` } };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = getContent().events.find((item) => item.slug === slug);
  if (!event) notFound();

  return (
    <article>
      <p className="meta">{formatEventDate(event.starts_at)}</p>
      <h1>{event.title}</h1>
      <p className="lead">{event.summary}</p>
      <p className="muted">
        {event.location} · {event.mode}
        {event.ends_at ? ` · ends ${formatEventDate(event.ends_at)}` : ""}
      </p>
      <p>
        {event.registration_url ? (
          <a className="button" href={event.registration_url}>
            Register
          </a>
        ) : null}{" "}
        {event.microsite_url ? (
          <a className="button secondary" href={event.microsite_url}>
            Event website
          </a>
        ) : null}
      </p>
      <Prose markdown={event.body} />
      <p>
        <Link href="/events">← All events</Link>
      </p>
    </article>
  );
}
