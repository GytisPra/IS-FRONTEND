import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Container,
  Card,
  CardContent,
  List,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Event {
  id: number;
  name: string;
  attendees: string[];
  description: string;
  details: string; // Additional details for each event
}

// Hardcoded list of events
const eventsFromBE: Event[] = [
  {
    id: 1,
    name: "Renginys 1",
    attendees: ["Dalyvis 1", "Dalyvis 2"],
    description: "Aprašymas 1",
    details:
      "Additional details about Renginys 1. This can include location, time, agenda, etc.",
  },
  {
    id: 2,
    name: "Renginys 2",
    attendees: ["Dalyvis 3", "Dalyvis 4"],
    description: "Aprašymas 2",
    details:
      "Additional details about Renginys 2. This can include location, time, agenda, etc.",
  },
  {
    id: 3,
    name: "Renginys 3",
    attendees: ["Dalyvis 5", "Dalyvis 6"],
    description: "Aprašymas 3",
    details:
      "Additional details about Renginys 3. This can include location, time, agenda, etc.",
  },
];

const UserPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDetailsClick = (eventId: number) => {
    setExpandedEventId((prevId) => (prevId === eventId ? null : eventId)); // Toggle the expanded state
  };

  // Filter events based on the search term
  const filteredEvents = eventsFromBE.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#f3f4f6",
        overflow: "hidden",
        padding: 2,
      }}
    >
      {/* Button positioned in the top right corner */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/update-profile")}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
      >
        Peržiūrėti profilį
      </Button>

      {/* Centered Content */}
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            textAlign: "center",
          }}
        >
          Čia yra naudotojo puslapis
        </Typography>

        {/* Event Search Section */}
        <Box sx={{ width: "100%", textAlign: "center", marginBottom: 4 }}>
          <Typography
            variant="h6"
            component="p"
            color="text.secondary"
            sx={{ marginBottom: 1 }}
          >
            Kokio renginio ieškote?
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search for events"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ marginBottom: 2 }}
          />
        </Box>

        {/* Event List */}
        <List sx={{ width: "100%" }}>
          {filteredEvents.map((event) => (
            <Card key={event.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginBottom: 2 }}
                >
                  Attendees: {event.attendees.join(", ")}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleViewDetailsClick(event.id)}
                >
                  {expandedEventId === event.id
                    ? "Hide Details"
                    : "View Details"}
                </Button>

                {/* Collapsible Section */}
                <Collapse
                  in={expandedEventId === event.id}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ mt: 2, paddingLeft: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {event.details}
                    </Typography>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))}
          {filteredEvents.length === 0 && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", mt: 2 }}
            >
              No events found.
            </Typography>
          )}
        </List>
      </Container>
    </Box>
  );
};

export default UserPage;
