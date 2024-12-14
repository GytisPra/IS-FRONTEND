import * as React from "react";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import EventCard from "./eventCard";
import EventRowCard from "../components/common/eventRowCard";
import { getEvents } from "./api";
import { Event } from "../volunteers/objects/types";

const OrganiserPage = () => {
  const [selectedEvent, setSelectedEvent] = React.useState<Event | undefined>(undefined);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [events, setEvents] = React.useState<Event[]>([] as Event[]);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getEvents();
        setEvents(events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  } , []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setSelectedEvent(undefined);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent((prev) => (prev === event ? undefined : event));
  };

  // React.useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  return (
    <Container ref={containerRef}>
      <Box sx={{ minWidth: 120, margin: "50px" }}>
        {events.map((event) => (
          <div key={event.id}>
            <EventRowCard
              event={
                {
                  attendees: event.seats_count,
                  description: event.description || "", 
                  name: event.name || "",
                  id: event.id,
                  startTime: new Date(event.date),
                }
              }
              height={150}
              onClick={() => handleEventClick(event)}
            />
            {selectedEvent?.id === event.id && (
              <EventCard event={selectedEvent} />
            )}
          </div>
        ))}
      </Box>
    </Container>
  );
}

export default OrganiserPage;