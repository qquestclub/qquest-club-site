// The ONLY place the site URL is decided (CONTRACT INV-5).
// Order: NEXT_PUBLIC_SITE_URL, then VERCEL_PROJECT_PRODUCTION_URL, then localhost for
// development. A production deployment must never fall through to localhost.

import { currentEnv, type Env } from "./env";

export const LOCAL_SITE_URL = "http://localhost:3000";

function normalise(url: string): string {
  const withProtocol = /^https?:\/\//.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, "");
}

export function getSiteUrl(env: Env = currentEnv()): string {
  const inProduction = env.VERCEL_ENV === "production";

  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const chosen = explicit || vercel;

  if (chosen) {
    const url = normalise(chosen);
    if (inProduction && url.includes("localhost")) {
      throw new Error(
        `Production site URL points at localhost (${url}). Set NEXT_PUBLIC_SITE_URL to the real address.`,
      );
    }
    return url;
  }

  if (inProduction) {
    throw new Error(
      "Production build has no site URL. Set NEXT_PUBLIC_SITE_URL in the Vercel project settings.",
    );
  }
  return LOCAL_SITE_URL;
}
