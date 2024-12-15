import * as React from "react";
import Box from "@mui/material/Box";
import { Container, CircularProgress, Typography } from "@mui/material";
import EventCard from "./eventCard";
import EventRowCard from "../components/common/eventRowCard";
import { getAttendeeCount, getEvents } from "./api";
import { Event } from "../volunteers/objects/types";
import { getSession } from "../userService";
import { useEffect } from "react";

const OrganiserPage = () => {
  const [selectedEvent, setSelectedEvent] = React.useState<Event | undefined>(undefined);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const setAttendees = async (events: Event[]) => {
      const updatedEvents = await Promise.all(events.map(async (event) => {
        event.attendees = await getAttendeeCount(event.id) || 0;
        return event;
      }));
      return updatedEvents;
    };

    const fetchEvents = async () => {
      try {
        const user = await getSession();
        const events = await getEvents(user.user!.id);
        const updatedEvents = await setAttendees(events);
        setEvents(updatedEvents);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (
  //     containerRef.current &&
  //     !containerRef.current.contains(event.target as Node)
  //   ) {
  //     setSelectedEvent(undefined);
  //   }
  // };

  const handleEventClick = (event: Event) => {
    setSelectedEvent((prev) => (prev === event ? undefined : event));
  };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container ref={containerRef}>
      <Box sx={{ minWidth: 120, margin: "50px" }}>
        {events.length === 0 ? (
          <Typography variant="h6" component="div">
            No events found.
          </Typography>
        ) : (
          events.map((event) => (
            <div key={event.id}>
              <EventRowCard
                event={{
                  attendees: event.attendees,
                  description: event.description || "",
                  name: event.name || "",
                  id: event.id,
                  startTime: new Date(event.date),
                }}
                height={150}
                onClick={() => handleEventClick(event)}
              />
              {selectedEvent?.id === event.id && (
                <EventCard event={selectedEvent} />
              )}
            </div>
          ))
        )}
      </Box>
    </Container>
  );
};

export default OrganiserPage;