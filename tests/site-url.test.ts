import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { LOCAL_SITE_URL, getSiteUrl } from "../src/lib/site-url";

describe("site url", () => {
  test("G-05: an explicit NEXT_PUBLIC_SITE_URL wins", () => {
    assert.equal(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://qquest.example" }), "https://qquest.example");
  });

  test("G-05: a trailing slash is removed", () => {
    assert.equal(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://qquest.example/" }), "https://qquest.example");
  });

  test("G-05: the Vercel production host gets https added", () => {
    assert.equal(getSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "qquest.vercel.app" }), "https://qquest.vercel.app");
  });

  test("G-05: the explicit value beats the Vercel host", () => {
    assert.equal(
      getSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://qquest.example", VERCEL_PROJECT_PRODUCTION_URL: "qquest.vercel.app" }),
      "https://qquest.example",
    );
  });

  test("G-05: with nothing set outside production, development uses localhost", () => {
    assert.equal(getSiteUrl({}), LOCAL_SITE_URL);
    assert.equal(LOCAL_SITE_URL, "http://localhost:3000");
    assert.equal(getSiteUrl({ VERCEL_ENV: "preview" }), "http://localhost:3000");
  });

  test("INV-5-T: a production deployment with no URL fails instead of using localhost", () => {
    assert.throws(() => getSiteUrl({ VERCEL_ENV: "production" }), /no site URL/);
  });

  test("INV-5-T: a production deployment pointed at localhost fails", () => {
    assert.throws(
      () => getSiteUrl({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }),
      /localhost/,
    );
  });

  test("INV-5-T: a production deployment with a Vercel host returns an https URL", () => {
    const url = getSiteUrl({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "qquest.vercel.app" });
    assert.ok(url.startsWith("https://"));
    assert.ok(!url.includes("localhost"));
  });
});
