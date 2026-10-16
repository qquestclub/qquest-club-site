import type { Metadata } from "next";
import { DigestCard } from "@/components/Cards";
import { getContent } from "@/lib/content/load";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: site.digestName, description: site.digestDescription };

export default function DigestPage() {
  const { digest } = getContent();
  return (
    <>
      <h1>{site.digestName}</h1>
      <p className="lead">{site.digestDescription}</p>
      <p>
        <a href="/feed.xml">Subscribe with RSS</a>
      </p>
      {digest.length > 0 ? (
        <div className="grid">
          {digest.map((issue) => (
            <DigestCard key={issue.slug} issue={issue} />
          ))}
        </div>
      ) : (
        <p className="muted">The first issue is on its way.</p>
      )}
    </>
  );
}
