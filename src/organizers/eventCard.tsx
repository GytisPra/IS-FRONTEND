import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, List, ListItem, ListItemText, Box, CircularProgress, Modal } from '@mui/material';
import { IEvent, IVolunteer } from './index';
import FormResponseBox from './formResponseBox';

const eventsFromBE: IEvent[] = [
    {
        id: 1,
        name: 'Renginys 1',
        description: 'Aprašymas 1',
        startTime: new Date(),
        attendees: ['Dalyvis 1', 'Dalyvis 2'],
        volunteers: [
        ],
        volunteerRequests: [
            { id: 3, email: '3@', name: 'Savanoris 3' },
            { id: 1, email: '3@', name: 'Savanoris 1' },
            { id: 4, email: '3@', name: 'Savanoris 4' },
            { id: 2, email: '3@', name: 'Savanoris 2' },
        ],
    },
    {
        id: 2,
        name: 'Renginys 2',
        description: 'Aprašymas 2',
        startTime: new Date(),
        attendees: ['Dalyvis 1', 'Dalyvis 2'],
        volunteers: [
        ],
        volunteerRequests: [
            { id: 3, email: '3@', name: 'Savanoris 3' },
            { id: 1, email: '3@', name: 'Savanoris 1' },
            { id: 4, email: '3@', name: 'Savanoris 4' },
            { id: 2, email: '3@', name: 'Savanoris 2' },
        ],
    },
    {
        id: 3,
        name: 'Renginys 3',
        description: 'Aprašymas 3',
        startTime: new Date(),
        attendees: ['Dalyvis 1', 'Dalyvis 2'],
        volunteers: [
        ],
        volunteerRequests: [
            { id: 3, email: '3@', name: 'Savanoris 3' },
            { id: 1, email: '3@', name: 'Savanoris 1' },
            { id: 4, email: '3@', name: 'Savanoris 4' },
            { id: 2, email: '3@', name: 'Savanoris 2' },
        ],
    },
]

const getEventById = async (eventId: number): Promise<IEvent> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const event = eventsFromBE.find(event => event.id === eventId) as IEvent;
            resolve(event);
        }, 1000);
    });
};

const EventCard = ({ eventId }: { eventId: number }) => {
    const [event, setEvent] = useState<IEvent | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        const fetchEvent = async () => {
            const eventData = await getEventById(eventId);
            setEvent(eventData);
        };

        fetchEvent();
    }, [eventId]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    if (!event) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', margin: 20 }}>
                <CircularProgress />
            </Box>
        );
    }

    const filteredVolunteers = event.volunteerRequests!.filter(volunteer =>
        volunteer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAcceptVolunteer = (volunteer: IVolunteer) => {
        setEvent({
            ...event,
            volunteers: [...event.volunteers!, volunteer],
            volunteerRequests: event.volunteerRequests!.filter(v => v.id !== volunteer.id),
        });
    }

    const handleDeclineVolunteer = (volunteer: IVolunteer) => {
        setEvent({
            ...event,
            volunteerRequests: event.volunteerRequests!.filter(v => v.id !== volunteer.id),
        });
    }

    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {event.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 5 }}>
                    {event.attendees.length} Dalyviai
                </Typography>
                <Typography variant="h6" component="div">
                    {event.attendees.length} Priimti savanoriai
                </Typography>
                <List>
                    {event.volunteers!.map(volunteer => (
                        <ListItem key={volunteer.id}>
                            <ListItemText primary={volunteer.name} />
                        </ListItem>
                    ))}
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
                    {filteredVolunteers.map(volunteer => (
                        <ListItem key={volunteer.id} sx={{ gap: 5 }}>
                            <ListItemText primary={volunteer.name} onClick={() => setIsModalOpen(true)} />
                            <Button variant="contained" color="success" onClick={() => handleAcceptVolunteer(volunteer)}>Priimti</Button>
                            <Button variant="contained" color="error" onClick={() => handleDeclineVolunteer(volunteer)}>Nepriimti</Button>
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
                <FormResponseBox response="Savanoris atsakė..." onClose={() => setIsModalOpen(false)} />
            </Modal>
        </Card>
    );
};

export default EventCard;