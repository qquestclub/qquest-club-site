import Link from "next/link";
import { TAG_LABELS } from "@/lib/content/tags";
import type { Digest, Entry, EventItem, Project } from "@/lib/content/schema";
import { formatDate, formatEventDate } from "@/lib/dates";

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
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
      <p className="card-meta font-mono">
        Issue {issue.issue} · {formatDate(issue.date)}
      </p>
      <h3 className="card-title">
        <Link href={`/digest/${issue.slug}`}>{issue.title}</Link>
      </h3>
      <p className="card-summary">{issue.summary}</p>
      <TagList tags={issue.tags.map((tag) => TAG_LABELS[tag] || tag)} />
    </article>
  );
}

export function EventCard({ event }: { event: Entry<EventItem> }) {
  return (
    <article className="card">
      <p className="card-meta font-mono">
        {formatEventDate(event.starts_at)} · {event.mode}
      </p>
      <h3 className="card-title">
        <Link href={`/events/${event.slug}`}>{event.title}</Link>
      </h3>
      <p className="card-summary">{event.summary}</p>
      <p className="card-subtext">{event.location}</p>
      {event.registration_url && (
        <div className="card-links">
          <a
            href={event.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Register on event portal ↗
          </a>
        </div>
      )}
    </article>
  );
}

export function ProjectCard({ project }: { project: Entry<Project> }) {
  return (
    <article className="card">
      <p className="card-meta font-mono">
        {project.year} · {project.status}
      </p>
      <h3 className="card-title">
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </h3>
      <p className="card-summary">{project.summary}</p>
      <TagList tags={project.tags} />
      {project.repo_url && (
        <div className="card-links">
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            GitHub repository ↗
          </a>
        </div>
      )}
    </article>
  );
}
