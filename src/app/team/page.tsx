import type { Metadata } from "next";
import { getContent } from "@/lib/content/load";

export const metadata: Metadata = { title: "Team", description: "The people behind QQuest." };

export default function TeamPage() {
  const { members } = getContent();
  const active = members.filter((member) => member.active);
  const alumni = members.filter((member) => !member.active);

  const render = (list: typeof members) => (
    <div className="grid">
      {list.map((member) => (
        <article className="card" key={member.slug} id={member.slug}>
          <h3>{member.name}</h3>
          <p className="meta">
            {member.role}
            {member.batch ? ` · batch ${member.batch}` : ""}
          </p>
          {member.bio ? <p>{member.bio}</p> : null}
          <p>
            {member.github ? (
              <a href={member.github} rel="noopener noreferrer">
                GitHub
              </a>
            ) : null}
            {member.github && member.linkedin ? " · " : null}
            {member.linkedin ? (
              <a href={member.linkedin} rel="noopener noreferrer">
                LinkedIn
              </a>
            ) : null}
          </p>
        </article>
      ))}
    </div>
  );

  return (
    <>
      <h1>Team</h1>
      <h2>Current members</h2>
      {active.length > 0 ? render(active) : <p className="muted">Members will be listed here.</p>}
      {alumni.length > 0 ? (
        <>
          <h2>Alumni</h2>
          {render(alumni)}
        </>
      ) : null}
    </>
  );
}
