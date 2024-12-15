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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormResponseBox from "./formResponseBox";
import { Event } from "../volunteers/objects/types";
import { getVolunteerApplications, IApplication, setApplicationStatus, createVolunteerStatistics, decrementEventVolunteerCount } from "./api";
import { ToastContainer } from 'react-toastify';

interface VolunteerStats {
  rating: number;
  minutes_worked: number;
  event_count: number;
  volunteer_id: string;
}

interface StatsErrors {
  rating: string;
  minutes_worked: string;
  event_count: string;
}

const VolunteerStatsModal = ({ open, onClose, volunteerId }: { 
  open: boolean;
  onClose: () => void;
  volunteerId: string;
}) => {
  const [stats, setStats] = useState<VolunteerStats>({
    rating: 0,
    minutes_worked: 0,
    event_count: 1,
    volunteer_id: volunteerId,
  });

  const [errors, setErrors] = useState<StatsErrors>({
    rating: '',
    minutes_worked: '',
    event_count: ''
  });

  useEffect(() => {
    setStats(currentStats => ({
      ...currentStats,
      volunteer_id: volunteerId
    }));
  }, [volunteerId]);

  const validateStats = () => {
    let isValid = true;
    const newErrors = {
      rating: '',
      minutes_worked: '',
      event_count: ''
    };

    if (stats.rating < 0 || stats.rating > 5) {
      newErrors.rating = 'Įvertinimas turi būti nuo 0 iki 5';
      isValid = false;
    }

    if (stats.minutes_worked <= 0) {
      newErrors.minutes_worked = 'Išdirbtas laikas turi būti teigiamas skaičius';
      isValid = false;
    }

    if (stats.event_count < 1) {
      newErrors.event_count = 'Renginių skaičius turi būti bent 1';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    try {
      if (!stats.volunteer_id) {
        toast.error('Nepasirinktas savanoris');
        return;
      }
  
      if (!validateStats()) {
        toast.error('Patikrinkite įvestus duomenis');
        return;
      }
      
      const response = await createVolunteerStatistics({
        rating: stats.rating,
        minutes_worked: stats.minutes_worked,
        event_count: stats.event_count,
        volunteer_id: stats.volunteer_id
      });
      
      if (response) {
        toast.success('Statistika sėkmingai išsaugota');
        onClose();
      }
    } catch (error) {
      toast.error('Įvyko klaida išsaugant statistiką');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="stats-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
      }}>
        <Typography id="stats-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Savanorio statistika
        </Typography>
        <TextField
          fullWidth
          label="Įvertinimas (0-5)"
          type="number"
          value={stats.rating}
          onChange={(e) => setStats({ ...stats, rating: parseFloat(e.target.value) })}
          inputProps={{ min: 0, max: 5, step: 0.1 }}
          error={!!errors.rating}
          helperText={errors.rating}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Išdirbtos minutės"
          type="number"
          value={stats.minutes_worked}
          onChange={(e) => setStats({ ...stats, minutes_worked: parseInt(e.target.value) })}
          inputProps={{ min: 0 }}
          error={!!errors.minutes_worked}
          helperText={errors.minutes_worked}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Renginių skaičius"
          type="number"
          value={stats.event_count}
          onChange={(e) => setStats({ ...stats, event_count: parseInt(e.target.value) })}
          inputProps={{ min: 1 }}
          error={!!errors.event_count}
          helperText={errors.event_count}
          sx={{ mb: 2 }}
        />
        <Button 
          fullWidth 
          variant="contained" 
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Išsaugoti
        </Button>
      </Box>
    </Modal>
  );
};

const EventCard = ({ event }: { event: Event }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState<string | undefined>(undefined);
  const [volunteerRequests, setVolunteerRequests] = useState<IApplication[] | undefined>(undefined);
  const [acceptedVolunteers, setAcceptedVolunteers] = useState<number>(0);
  const [selectedVolunteerForStats, setSelectedVolunteerForStats] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const applications = await getVolunteerApplications(event.id);
        const notCancelledApplications = applications.filter((application) => application.status !== "atmesta");
        setVolunteerRequests(notCancelledApplications);

        const accepted = applications.filter((application) => application.status === "priimta");
        setAcceptedVolunteers(accepted.length);
      } catch (error) {
        toast.error('Nepavyko gauti savanorių sąrašo');
      }
    })();
  }, [event.id]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleModalOpen = (userId: string) => {
    setModalUserId(userId);
    setIsModalOpen(true);
  };

  const handleOpenStatsModal = (volunteerId: string) => {
    setSelectedVolunteerForStats(volunteerId);
  };

  const handleCloseStatsModal = () => {
    setSelectedVolunteerForStats(null);
  };

  const filteredVolunteers = volunteerRequests?.filter((volunteer) =>
    volunteer.status === 'laukiama' &&
    volunteer.volunteer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      await setApplicationStatus(applicationId, "priimta");
      await decrementEventVolunteerCount(event.id);
      event.available_volunteers -= 1;
      const updatedRequests = volunteerRequests?.map((application) => {
        if (application.id === applicationId) {
          return { ...application, status: 'priimta' };
        }
        return application;
      });
      setVolunteerRequests(updatedRequests);
      setAcceptedVolunteers((prev) => prev + 1);
      toast.success('Savanoris priimtas');
    } catch (error) {
      toast.error('Nepavyko priimti savanorio');
    }
  };

  const handleDeclineApplication = async (applicationId: string) => {
    try {
      await setApplicationStatus(applicationId, "atmesta");
      const updatedRequests = volunteerRequests?.map((application) => {
        if (application.id === applicationId) {
          return { ...application, status: 'atmesta' };
        }
        return application;
      });
      setVolunteerRequests(updatedRequests);
      toast.success('Savanoris atmestas');
    } catch (error) {
      toast.error('Nepavyko atmesti savanorio');
    }
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

  return (
    <>
     <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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

        {/* Accepted Volunteers List */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Priimti savanoriai
        </Typography>
        <List>
          {volunteerRequests?.filter((application) => application.status === 'priimta').map((application) => (
            <ListItem 
              key={application.volunteer.id}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid #eee'
              }}
            >
              <ListItemText 
                primary={application.volunteer.name}
                onClick={() => handleModalOpen(application.volunteer.id)}
                sx={{ cursor: "pointer" }}
              />
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => handleOpenStatsModal(application.volunteer.id)}
                sx={{ ml: 2 }}
              >
                Pridėti statistiką
              </Button>
            </ListItem>
          ))}
        </List>

        {/* Pending Volunteers Section */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Laukiantys savanoriai
        </Typography>
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
            <ListItem 
              key={application.id}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #eee'
              }}
            >
              <ListItemText
                primary={application.volunteer.name}
                onClick={() => handleModalOpen(application.volunteer.id)}
                sx={{ cursor: "pointer" }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleAcceptApplication(application.id)}
                >
                  Priimti
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDeclineApplication(application.id)}
                >
                  Atmesti
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>

        {/* Modals */}
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box>
            <FormResponseBox
              userId={modalUserId!}
              formUrl={event.form_url}
              onClose={() => setIsModalOpen(false)}
            />
          </Box>
        </Modal>

        {selectedVolunteerForStats && (
          <VolunteerStatsModal
            open={true}
            onClose={handleCloseStatsModal}
            volunteerId={selectedVolunteerForStats}
          />
        )}
      </CardContent>
    </Card>
    </>
  );
};

export default EventCard;