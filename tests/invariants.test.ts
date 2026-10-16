import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";

const root = process.cwd();

// INV-1: adding a dependency means adding it HERE, with a spec/decisions.md entry in the
// same pull request. This list is the tripwire that makes that conversation happen.
const ALLOWED_DEPENDENCIES = new Set(["marked", "next", "react", "react-dom", "yaml", "zod"]);
const ALLOWED_DEV_DEPENDENCIES = new Set(["@types/node", "@types/react", "@types/react-dom", "tsx", "typescript"]);

function sourceFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...sourceFiles(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) found.push(full);
  }
  return found;
}

describe("invariants", () => {
  test("INV-1-T: every dependency is on the approved list", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    const unlisted = [
      ...Object.keys(pkg.dependencies ?? {}).filter((name) => !ALLOWED_DEPENDENCIES.has(name)),
      ...Object.keys(pkg.devDependencies ?? {}).filter((name) => !ALLOWED_DEV_DEPENDENCIES.has(name)),
    ];
    assert.deepEqual(
      unlisted,
      [],
      `Not on the approved list: ${unlisted.join(", ")}. Add a spec/decisions.md entry, then add the name to tests/invariants.test.ts.`,
    );
  });

  test("INV-2-T: nothing under src/ uses a database or an auth provider", () => {
    const forbidden = [/DATABASE_URL/i, /@clerk/i, /@neondatabase/i, /\bprisma\b/i, /\bdrizzle\b/i];
    const offenders: string[] = [];
    for (const file of sourceFiles(path.join(root, "src"))) {
      const text = fs.readFileSync(file, "utf8");
      for (const pattern of forbidden) {
        if (pattern.test(text)) offenders.push(`${path.relative(root, file)} matches ${pattern}`);
      }
    }
    assert.deepEqual(offenders, [], "v1 must work with every backend off (CONTRACT INV-2)");
  });

  test("INV-2-T: process.env is read only in src/lib/env.ts", () => {
    const offenders = sourceFiles(path.join(root, "src"))
      .filter((file) => path.relative(root, file) !== path.join("src", "lib", "env.ts"))
      .filter((file) => /process\.env/.test(fs.readFileSync(file, "utf8")))
      .map((file) => path.relative(root, file));
    assert.deepEqual(offenders, [], "Read environment variables through src/lib/env.ts so v1 stays secret-free");
  });

  test("INV-2-T: .gitignore keeps secret files out of git but keeps .env.example", () => {
    // Developers may have a local .env.local; it must be ignored. This checks the rule exists.
    const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
    assert.ok(gitignore.includes(".env"), ".gitignore must ignore .env files");
    assert.ok(gitignore.includes("!.env.example"), ".gitignore must keep .env.example");
  });
});
