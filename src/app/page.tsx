import Link from "next/link";
import { DigestCard, EventCard, ProjectCard } from "@/components/Cards";
import { getContent } from "@/lib/content/load";
import { splitEvents } from "@/lib/dates";
import { site } from "@/lib/site";

// Re-built at most hourly so "upcoming" stays correct (CONTRACT: REVALIDATE_SECONDS = 3600).
export const revalidate = 3600;

export default function HomePage() {
  const content = getContent();
  const latest = content.digest.slice(0, 3);
  const { upcoming } = splitEvents(content.events, new Date());
  const next = upcoming[0];
  const projects = content.projects.slice(0, 3);

  return (
    <>
      <section className="hero">
        <h1>{site.tagline}</h1>
        <p className="lead">{site.description}</p>
        <p>
          <Link className="button" href="/join">
            Join the club
          </Link>{" "}
          <Link className="button secondary" href="/digest">
            Read the digest
          </Link>
        </p>
      </section>

      <section>
        <h2>Latest from the digest</h2>
        {latest.length > 0 ? (
          <div className="grid">
            {latest.map((issue) => (
              <DigestCard key={issue.slug} issue={issue} />
            ))}
          </div>
        ) : (
          <p className="muted">The first issue is on its way.</p>
        )}
      </section>

      <section>
        <h2>Next event</h2>
        {next ? <EventCard event={next} /> : <p className="muted">No event is scheduled right now. Check back soon.</p>}
      </section>

      <section>
        <h2>Projects</h2>
        {projects.length > 0 ? (
          <div className="grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="muted">Our first projects will show up here.</p>
        )}
      </section>
    </>
  );
}
