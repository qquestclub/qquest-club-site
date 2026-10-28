import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label="QQuest Home">
              <Image
                src="/brand/qquest-logo.png"
                alt="QQuest Logo"
                width={36}
                height={36}
                className="brand-logo"
              />
              <span className="brand-name">{site.name}</span>
            </Link>
            <p className="footer-tagline">{site.tagline}</p>
            <p className="footer-description">
              The permanent quantum computing club of MIT Art, Design and Technology University, Pune.
            </p>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <h4>Navigation</h4>
              <ul>
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Connect</h4>
              <ul>
                <li>
                  <a href={`mailto:${site.contactEmail}`}>Email Club</a>
                </li>
                <li>
                  <a href={site.github} target="_blank" rel="noopener noreferrer">
                    GitHub Org
                  </a>
                </li>
                <li>
                  <a href="https://qff-2026-site.vercel.app/" target="_blank" rel="noopener noreferrer">
                    Qiskit Fall Fest 2026 ↗
                  </a>
                </li>
                <li>
                  <Link href="/feed.xml">RSS Feed</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="muted">
            Qiskit and IBM are trademarks of IBM. QQuest is an independent student club at MIT-ADT University and is not run by IBM.
          </p>
          <p className="footer-copy">
            © {new Date().getFullYear()} {site.name} • MIT-ADT University, Pune. 100% Free & Open Source.
          </p>
        </div>
      </div>
    </footer>
  );
}
