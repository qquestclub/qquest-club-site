import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          <strong>{site.name}</strong> · {site.tagline}
        </p>
        <p>
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> · <a href={site.github}>GitHub</a> ·{" "}
          <a href="/feed.xml">RSS</a>
        </p>
        <p className="muted">
          Qiskit and IBM are trademarks of IBM. QQuEST is a student club and is not run by IBM.
        </p>
      </div>
    </footer>
  );
}
