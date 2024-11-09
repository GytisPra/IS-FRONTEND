import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button, Container } from "@mui/material";
import TicketRowCard from "../components/common/ticketRowCard";
import TicketCard from "./ticketCard";

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
    name: "Bilietas 1",
    description: "Galiojantis",
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
    name: "Bilietas 2",
    description: "Galiojantis",
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
    name: "Bilietas 3",
    description: "Pasibaigęs",
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

export default function UserTickets() {
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

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedEvent(Number(event.target.value));
  };

  return (
    <Container ref={containerRef}>
      <Box sx={{ minWidth: 120, margin: "50px" }}>
        {eventsFromBE.map((event) => (
          <div key={event.id}>
            <TicketRowCard
              event={event}
              height={150}
              onClick={() => handleEventClick(event.id)}
            />
            {selectedEvent === event.id && (
              <TicketCard
                eventId={selectedEvent}
                onAcceptVolunteer={(volunteerId) => {
                  // Handle accept volunteer logic here
                }}
                onDeclineVolunteer={(volunteerId) => {
                  // Handle decline volunteer logic here
                }}
              />
            )}
          </div>
        ))}
      </Box>
    </Container>
  );
}
