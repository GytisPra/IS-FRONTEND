import * as React from "react";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import EventCard from "./eventCard";
import EventRowCard from "../components/common/eventRowCard";

export interface IVolunteer {
  id: number;
  name: string;
  email: string;
}

export interface IEvent {
  id: number;
  name: string;
  description: string;
  startTime: Date;
  attendees: string[];
  volunteers?: IVolunteer[];
  volunteerRequests?: IVolunteer[];
}

const eventsFromBE: IEvent[] = [
  {
    id: 1,
    name: "Renginys 1",
    description: "Aprašymas 1",
    startTime: new Date(),
    attendees: ["Dalyvis 1", "Dalyvis 2"],
    volunteers: [],
    volunteerRequests: [
      { id: 3, email: "3@", name: "Savanoris 3" },
      { id: 1, email: "3@", name: "Savanoris 1" },
      { id: 4, email: "3@", name: "Savanoris 4" },
      { id: 2, email: "3@", name: "Savanoris 2" },
    ],
  },
  {
    id: 2,
    name: "Renginys 2",
    description: "Aprašymas 2",
    startTime: new Date(),
    attendees: ["Dalyvis 1", "Dalyvis 2"],
    volunteers: [],
    volunteerRequests: [
      { id: 3, email: "3@", name: "Savanoris 3" },
      { id: 1, email: "3@", name: "Savanoris 1" },
      { id: 4, email: "3@", name: "Savanoris 4" },
      { id: 2, email: "3@", name: "Savanoris 2" },
    ],
  },
  {
    id: 3,
    name: "Renginys 3",
    description: "Aprašymas 3",
    startTime: new Date(),
    attendees: ["Dalyvis 1", "Dalyvis 2"],
    volunteers: [],
    volunteerRequests: [
      { id: 3, email: "3@", name: "Savanoris 3" },
      { id: 1, email: "3@", name: "Savanoris 1" },
      { id: 4, email: "3@", name: "Savanoris 4" },
      { id: 2, email: "3@", name: "Savanoris 2" },
    ],
  },
];

export default function BasicSelect() {
  const [selectedEvent, setSelectedEvent] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Handle clicking on the same event or clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setSelectedEvent(null);
    }
  };

  // Toggle event selection
  const handleEventClick = (eventId: number) => {
    setSelectedEvent((prevSelected) =>
      prevSelected === eventId ? null : eventId
    );
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Container ref={containerRef}>
      <Box sx={{ minWidth: 120, margin: "50px" }}>
        {eventsFromBE.map((event) => (
          <div key={event.id}>
            <EventRowCard
              event={event}
              height={150}
              onClick={() => handleEventClick(event.id)}
            />
            {selectedEvent === event.id && (
              <EventCard
                eventId={selectedEvent}
                onAcceptVolunteer={(volunteerId) => {
                  console.log(volunteerId);
                }}
                onDeclineVolunteer={(volunteerId) => {
                  console.log(volunteerId);
                }}
              />
            )}
          </div>
        ))}
      </Box>
    </Container>
  );
}