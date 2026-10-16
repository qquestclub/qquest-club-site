import type { Metadata } from "next";
import { EventCard } from "@/components/Cards";
import { getContent } from "@/lib/content/load";
import { splitEvents } from "@/lib/dates";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Events", description: "Upcoming and past QQuEST events." };

export default function EventsPage() {
  const { upcoming, past } = splitEvents(getContent().events, new Date());
  return (
    <>
      <h1>Events</h1>
      <h2>Upcoming</h2>
      {upcoming.length > 0 ? (
        <div className="grid">
          {upcoming.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      ) : (
        <p className="muted">No event is scheduled right now. Check back soon.</p>
      )}
      <h2>Past</h2>
      {past.length > 0 ? (
        <div className="grid">
          {past.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      ) : (
        <p className="muted">Nothing here yet.</p>
      )}
    </>
  );
}
