// src/components/MainComponent.tsx

import { useState } from "react";
import { Container, Box, Button, Snackbar, Alert } from "@mui/material";
import EventRowCard, { Event } from "../components/common/eventRowCard";
import VolunteerEventDetail from "./VolunteerEventCard"; // Volunteer detail component

// Sample data
const eventsFromBE: Event[] = [
  {
    id: 1,
    name: "Renginys 1",
    description: "Aprašymas 1",
    startTime: new Date("2024-12-01T10:00:00"),
    attendees: ["Dalyvis 1", "Dalyvis 2"],
  },
  {
    id: 2,
    name: "Renginys 2",
    description: "Aprašymas 2",
    startTime: new Date("2024-12-05T14:00:00"),
    attendees: ["Dalyvis 3", "Dalyvis 4"],
  },
  {
    id: 3,
    name: "Renginys 3",
    description: "Aprašymas 3",
    startTime: new Date("2024-12-10T09:00:00"),
    attendees: ["Dalyvis 5", "Dalyvis 6"],
  },
];

export default function MainComponent() {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSelectEvent = (eventId: number) => {
    setSelectedEventId((prev) => (prev === eventId ? null : eventId));
  };

  const handleApply = (eventId: number) => {
    // Handle the apply logic, e.g., send a request to the backend
    console.log(`Volunteer applied to event with ID: ${eventId}`);
    setSnackbar({
      open: true,
      message: "Successfully applied to volunteer!",
      severity: "success",
    });
    // Optionally, update the UI or state
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container>
      <Box sx={{ minWidth: 120, margin: "50px 0" }}>
        {/* Event List */}
        {eventsFromBE.map((event) => (
          <div key={event.id}>
            <EventRowCard
              event={event}
              height={150}
              button={
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSelectEvent(event.id)}
                >
                  {selectedEventId === event.id
                    ? "Hide Details"
                    : "View & Apply"}
                </Button>
              }
            />
            {/* Conditional Rendering Based on Selected Event */}
            {selectedEventId === event.id && (
              <VolunteerEventDetail
                event={event} // Pass the entire event object
                onApply={handleApply}
              />
            )}
          </div>
        ))}
      </Box>

      {/* Snackbar for User Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
