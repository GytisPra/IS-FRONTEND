import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Modal,
} from "@mui/material";
import FormResponseBox from "./formResponseBox";
import { Event } from "../volunteers/objects/types";
import { getVolunteerApplications, IApplication, setApplicationStatus } from "./api";

const EventCard = ({ event }: { event: Event }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [volunteerRequests, setVolunteerRequests] = useState<IApplication[] | undefined>(undefined);
  const [acceptedVolunteers, setAcceptedVolunteers] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const applications = await getVolunteerApplications(event.id);
        const notCancelledApplications = applications.filter((application) => application.status !== "atmesta");
        setVolunteerRequests(notCancelledApplications);

        const accepted = applications.filter((application) => application.status === "priimta");
        setAcceptedVolunteers(accepted.length);

      } catch (error) {
        console.error("Failed to fetch volunteers:", error);
      }
    })();
  }, [event.id]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (!event) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          margin: 20,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const filteredVolunteers = volunteerRequests?.filter((volunteer) =>
    volunteer.status === 'laukiama' &&
    volunteer.volunteer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAcceptApplication = (applicationId: string) => {
    const updatedRequests = volunteerRequests?.map((application) => {
      if (application.id === applicationId) {
        return { ...application, status: 'priimta' };
      }
      return application;
    });
    setVolunteerRequests(updatedRequests);
    setApplicationStatus(applicationId, "priimta");
    // Todo: Update the accepted volunteers count
  };
  
  const handleDeclineApplication = (applicationId: string) => {
    const updatedRequests = volunteerRequests?.map((application) => {
      if (application.id === applicationId) {
        return { ...application, status: 'atmesta' };
      }
      return application;
    });
    setVolunteerRequests(updatedRequests);
    setApplicationStatus(applicationId, "atmesta");
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {event.name}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ marginBottom: 5 }}
        >
          {event.available_volunteers} Likusių savanorystės vietų
        </Typography>
        <Typography variant="h6" component="div">
          {acceptedVolunteers} Priimtų savanorių
        </Typography>
        <List>
          <List>
            {volunteerRequests?.filter((application) => application.status === 'priimta').map((application) => (
              <ListItem key={application.volunteer.id}>
                <ListItemText primary={application.volunteer.name} />
              </ListItem>
            ))}
          </List>
        </List>
        <TextField
          label="Ieškoti savanorių"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <List>
          {filteredVolunteers?.map((application) => (
            <ListItem key={application.id} sx={{ gap: 5 }}>
              <ListItemText
                primary={application.volunteer.name}
                onClick={() => setIsModalOpen(true)}
                sx={{ cursor: "pointer" }}
              />
              <Button
                variant="contained"
                color="success"
                onClick={() => handleAcceptApplication(application.id)}
              >
                Priimti
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeclineApplication(application.id)}
              >
                Nepriimti
              </Button>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <FormResponseBox
          response="Savanoris atsakė..."
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </Card>
  );
};

export default EventCard;
