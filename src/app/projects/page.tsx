import type { Metadata } from "next";
import { ProjectCard } from "@/components/Cards";
import { getContent } from "@/lib/content/load";

export const metadata: Metadata = { title: "Projects", description: "What QQuest members have built." };

export default function ProjectsPage() {
  const { projects } = getContent();
  return (
    <>
      <h1>Projects</h1>
      {projects.length > 0 ? (
        <div className="grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className="muted">Our first projects will show up here.</p>
      )}
    </>
  );
}
