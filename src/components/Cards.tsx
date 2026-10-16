import Link from "next/link";
import { TAG_LABELS } from "@/lib/content/tags";
import type { Digest, Entry, EventItem, Project } from "@/lib/content/schema";
import { formatDate, formatEventDate } from "@/lib/dates";

export function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="tags" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

export function DigestCard({ issue }: { issue: Entry<Digest> }) {
  return (
    <article className="card">
      <p className="meta">
        Issue {issue.issue} · {formatDate(issue.date)}
      </p>
      <h3>
        <Link href={`/digest/${issue.slug}`}>{issue.title}</Link>
      </h3>
      <p>{issue.summary}</p>
      <TagList tags={issue.tags.map((tag) => TAG_LABELS[tag])} />
    </article>
  );
}

export function EventCard({ event }: { event: Entry<EventItem> }) {
  return (
    <article className="card">
      <p className="meta">{formatEventDate(event.starts_at)}</p>
      <h3>
        <Link href={`/events/${event.slug}`}>{event.title}</Link>
      </h3>
      <p>{event.summary}</p>
      <p className="muted">
        {event.location} · {event.mode}
      </p>
    </article>
  );
}

export function ProjectCard({ project }: { project: Entry<Project> }) {
  return (
    <article className="card">
      <p className="meta">
        {project.year} · {project.status}
      </p>
      <h3>
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </h3>
      <p>{project.summary}</p>
      <TagList tags={project.tags} />
    </article>
  );
}
