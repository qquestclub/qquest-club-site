import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TagList } from "@/components/Cards";
import { Prose } from "@/components/Prose";
import { getContent } from "@/lib/content/load";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getContent().projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getContent().projects.find((item) => item.slug === slug);
  if (!project) return {};
  return { title: project.title, description: project.summary, alternates: { canonical: `/projects/${slug}` } };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const content = getContent();
  const project = content.projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const team = project.team.map((memberSlug) => content.members.find((member) => member.slug === memberSlug));
  const links = [
    { label: "Repository", url: project.repo_url },
    { label: "Demo", url: project.demo_url },
    { label: "Write-up", url: project.writeup_url },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));

  return (
    <article>
      <p className="meta">
        {project.year} · {project.status}
      </p>
      <h1>{project.title}</h1>
      <p className="lead">{project.summary}</p>
      <TagList tags={project.tags} />
      <Prose markdown={project.body} />
      <h2>Team</h2>
      <ul>
        {team.map((member, index) => (
          <li key={project.team[index]}>
            {member ? <Link href={`/team#${member.slug}`}>{member.name}</Link> : project.team[index]}
          </li>
        ))}
      </ul>
      {links.length > 0 ? (
        <>
          <h2>Links</h2>
          <ul>
            {links.map((link) => (
              <li key={link.url}>
                <a href={link.url} rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <p>
        <Link href="/projects">← All projects</Link>
      </p>
    </article>
  );
}
