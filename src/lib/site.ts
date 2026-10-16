// Site-wide wording. Edit this file to change the name, tagline and navigation.
// The tagline and digest name are PROVISIONAL until task M1-BRAND-01 decides them.

export const site = {
  name: "QQuEST",
  tagline: "Kyu QQuEST? Because we like to ask why.",
  description:
    "QQuEST is the quantum computing club of MIT-ADT University, Pune. We run events, build projects and publish a weekly digest of what happened in quantum.",
  digestName: "QQuEST Weekly Digest",
  digestDescription: "A weekly, source-cited look at what happened in quantum computing, written by QQuEST members.",
  // Taken from the QFF 2026 site; confirm it is the club's role mailbox (M0-OWN-01).
  contactEmail: "qquest@mitadt.edu.in",
  github: "https://github.com/qquestclub",
  nav: [
    { href: "/", label: "Home" },
    { href: "/digest", label: "Digest" },
    { href: "/events", label: "Events" },
    { href: "/projects", label: "Projects" },
    { href: "/team", label: "Team" },
    { href: "/about", label: "About" },
    { href: "/join", label: "Join" },
  ],
} as const;
