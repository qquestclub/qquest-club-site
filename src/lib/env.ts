// The ONLY file in src/ allowed to read process.env (checked by test INV-2-T).
// Keeping environment access in one place makes it obvious that v1 needs no secrets.

export type Env = Record<string, string | undefined>;

export function currentEnv(): Env {
  return process.env;
}

export function isProduction(env: Env = currentEnv()): boolean {
  return env.NODE_ENV === "production";
}
