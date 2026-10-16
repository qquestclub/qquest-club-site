// The ONLY place dates are formatted (CONTRACT INV-4).
// Everything is displayed in India Standard Time, whatever timezone the build machine
// or the visitor uses.

export const DISPLAY_TIMEZONE = "Asia/Kolkata";
export const DISPLAY_TZ_LABEL = "IST";
const IST_OFFSET = "+05:30";

type Parts = Intl.DateTimeFormatPart[];

function part(parts: Parts, type: Intl.DateTimeFormatPartTypes): string {
  const found = parts.find((p) => p.type === type);
  if (!found) throw new Error(`date formatting is missing the "${type}" part`);
  return found.value;
}

function parseInstant(iso: string): Date {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`"${iso}" is not a valid ISO 8601 timestamp`);
  }
  return date;
}

/** "2026-10-13" becomes "13 Oct 2026". Date-only values have no timezone. */
export function formatDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) throw new Error(`formatDate expects YYYY-MM-DD, got "${isoDate}"`);
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error(`"${isoDate}" is not a real calendar date`);
  }
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).formatToParts(date);
  return `${part(parts, "day")} ${part(parts, "month")} ${part(parts, "year")}`;
}

/** "2026-11-03T09:30:00+05:30" becomes "3 Nov 2026, 9:30 AM IST". */
export function formatEventDate(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(parseInstant(iso));
  const date = `${part(parts, "day")} ${part(parts, "month")} ${part(parts, "year")}`;
  const time = `${part(parts, "hour")}:${part(parts, "minute")} ${part(parts, "dayPeriod").toUpperCase()}`;
  return `${date}, ${time} ${DISPLAY_TZ_LABEL}`;
}

/** The last instant (23:59:59.999 IST) of the calendar day, in IST, that contains `iso`. */
export function endOfDayIst(iso: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(parseInstant(iso));
  const stamp = `${part(parts, "year")}-${part(parts, "month")}-${part(parts, "day")}T23:59:59.999${IST_OFFSET}`;
  return Date.parse(stamp);
}

export interface Timed {
  starts_at: string;
  ends_at?: string;
}

/** An event is upcoming until its end; with no end time, until the end of its day in IST. */
export function eventEndsAt(event: Timed): number {
  return event.ends_at ? parseInstant(event.ends_at).getTime() : endOfDayIst(event.starts_at);
}

/** Splits events into upcoming (soonest first) and past (latest first). */
export function splitEvents<T extends Timed>(events: T[], now: Date): { upcoming: T[]; past: T[] } {
  const start = (e: T) => parseInstant(e.starts_at).getTime();
  const upcoming = events.filter((e) => eventEndsAt(e) >= now.getTime()).sort((a, b) => start(a) - start(b));
  const past = events.filter((e) => eventEndsAt(e) < now.getTime()).sort((a, b) => start(b) - start(a));
  return { upcoming, past };
}
