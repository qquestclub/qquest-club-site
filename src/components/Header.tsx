import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="QQuest Home">
          <Image
            src="/brand/qquest-logo.png"
            alt="QQuest Logo"
            width={38}
            height={38}
            className="brand-logo"
            priority
          />
          <span className="brand-name">{site.name}</span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={item.href === "/join" ? "nav-link nav-cta" : "nav-link"}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
