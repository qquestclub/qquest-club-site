import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { formatDate, formatEventDate, splitEvents } from "../src/lib/dates";

describe("dates", () => {
  test("G-01: formatDate renders a date-only value", () => {
    assert.equal(formatDate("2026-10-13"), "13 Oct 2026");
  });

  test("G-01: formatDate rejects things that are not real calendar dates", () => {
    assert.throws(() => formatDate("2026-02-30"), /not a real calendar date/);
    assert.throws(() => formatDate("13-10-2026"), /YYYY-MM-DD/);
  });

  test("G-02: formatEventDate shows IST for a timestamp written in IST", () => {
    assert.equal(formatEventDate("2026-11-03T09:30:00+05:30"), "3 Nov 2026, 9:30 AM IST");
  });

  test("G-02: formatEventDate shows the same IST time for the same instant written in UTC", () => {
    assert.equal(formatEventDate("2026-11-03T04:00:00Z"), "3 Nov 2026, 9:30 AM IST");
  });

  test("G-02: afternoon times use PM and midnight uses 12", () => {
    assert.equal(formatEventDate("2026-11-03T15:00:00+05:30"), "3 Nov 2026, 3:00 PM IST");
    assert.equal(formatEventDate("2026-11-03T00:05:00+05:30"), "3 Nov 2026, 12:05 AM IST");
  });

  test("G-02: formatEventDate rejects a value that is not a timestamp", () => {
    assert.throws(() => formatEventDate("next tuesday"), /not a valid ISO 8601/);
  });

  describe("G-03: splitEvents", () => {
    const qff = { name: "qff", starts_at: "2026-11-03T09:30:00+05:30" };
    const old = { name: "old", starts_at: "2026-09-01T17:00:00+05:30" };
    const names = (list: { name: string }[]) => list.map((e) => e.name);

    test("G-03: before the event, QFF is upcoming and the old event is past", () => {
      const result = splitEvents([old, qff], new Date("2026-10-13T12:00:00+05:30"));
      assert.deepEqual(names(result.upcoming), ["qff"]);
      assert.deepEqual(names(result.past), ["old"]);
    });

    test("G-03: an event with no end time is still upcoming later on its own day", () => {
      const result = splitEvents([qff], new Date("2026-11-03T12:00:00+05:30"));
      assert.deepEqual(names(result.upcoming), ["qff"]);
    });

    test("G-03: it is past from midnight IST onward", () => {
      const result = splitEvents([qff], new Date("2026-11-04T00:00:00+05:30"));
      assert.deepEqual(names(result.past), ["qff"]);
      assert.deepEqual(result.upcoming, []);
    });

    test("G-03: an explicit end time wins over the end of the day", () => {
      const evening = { name: "evening", starts_at: "2026-11-03T09:30:00+05:30", ends_at: "2026-11-03T11:00:00+05:30" };
      const result = splitEvents([evening], new Date("2026-11-03T12:00:00+05:30"));
      assert.deepEqual(names(result.past), ["evening"]);
    });

    test("G-03: upcoming is soonest first, past is latest first", () => {
      const a = { name: "a", starts_at: "2026-12-01T10:00:00+05:30" };
      const b = { name: "b", starts_at: "2026-11-01T10:00:00+05:30" };
      const c = { name: "c", starts_at: "2026-01-01T10:00:00+05:30" };
      const d = { name: "d", starts_at: "2026-02-01T10:00:00+05:30" };
      const result = splitEvents([a, c, b, d], new Date("2026-10-13T12:00:00+05:30"));
      assert.deepEqual(names(result.upcoming), ["b", "a"]);
      assert.deepEqual(names(result.past), ["d", "c"]);
    });
  });
});
