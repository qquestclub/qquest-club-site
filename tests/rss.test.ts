import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildRss, escapeXml, type FeedItem } from "../src/lib/rss";

const meta = {
  title: "QQuEST Weekly Digest",
  description: "A weekly quantum digest",
  siteUrl: "https://qquest.example",
};

const item: FeedItem = {
  title: "Issue 1: Qubits & Coffee",
  slug: "issue-001-qubits-and-coffee",
  date: "2026-10-13",
  summary: "A plain-English look at <qubits>",
  tags: ["education"],
};

describe("rss", () => {
  test("G-04: buildRss produces exactly this feed for one issue", () => {
    const expected = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
      "<channel>",
      "<title>QQuEST Weekly Digest</title>",
      "<link>https://qquest.example</link>",
      "<description>A weekly quantum digest</description>",
      "<language>en-IN</language>",
      '<atom:link href="https://qquest.example/feed.xml" rel="self" type="application/rss+xml"/>',
      "<lastBuildDate>Tue, 13 Oct 2026 00:00:00 GMT</lastBuildDate>",
      "<item>",
      "<title>Issue 1: Qubits &amp; Coffee</title>",
      "<link>https://qquest.example/digest/issue-001-qubits-and-coffee</link>",
      '<guid isPermaLink="true">https://qquest.example/digest/issue-001-qubits-and-coffee</guid>',
      "<pubDate>Tue, 13 Oct 2026 00:00:00 GMT</pubDate>",
      "<description>A plain-English look at &lt;qubits&gt;</description>",
      "<category>education</category>",
      "</item>",
      "</channel>",
      "</rss>",
      "",
    ].join("\n");
    assert.equal(buildRss(meta, [item]), expected);
  });

  test("G-04: with no issues the feed is still valid and has no items", () => {
    const xml = buildRss(meta, []);
    assert.ok(xml.includes("<channel>"));
    assert.ok(!xml.includes("<item>"));
    assert.ok(!xml.includes("lastBuildDate"));
  });

  test("G-04: only the latest 20 issues are included, newest first", () => {
    const items: FeedItem[] = Array.from({ length: 25 }, (_, i) => ({
      ...item,
      slug: `issue-${String(i + 1).padStart(3, "0")}-x`,
      date: `2026-01-${String(i + 1).padStart(2, "0")}`,
    }));
    const xml = buildRss(meta, items);
    assert.equal(xml.split("<item>").length - 1, 20);
    assert.ok(xml.indexOf("issue-025-x") < xml.indexOf("issue-006-x"));
    assert.ok(!xml.includes("issue-005-x"));
  });

  test("N-04: escapeXml escapes every XML special character", () => {
    assert.equal(escapeXml(`a & b < c > d "e" 'f'`), "a &amp; b &lt; c &gt; d &quot;e&quot; &apos;f&apos;");
  });

  test("N-04: a script tag in a title or summary never appears raw", () => {
    const hostile: FeedItem = {
      ...item,
      title: "<script>alert(1)</script>",
      summary: 'x" onload="alert(1)',
    };
    const xml = buildRss(meta, [hostile]);
    assert.ok(!xml.includes("<script>"));
    assert.ok(xml.includes("&lt;script&gt;"));
    assert.ok(!xml.includes('onload="'));
  });
});
