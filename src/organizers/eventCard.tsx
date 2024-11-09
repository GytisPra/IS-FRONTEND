import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

export interface Volunteer {
    id: number;
    name: string;
}

export interface Event {
    id: number;
    name: string;
    attendees: string[];
    volunteers: Volunteer[];
    volunteerRequests: Volunteer[];
}

const eventsFromBE = [
    {
        id: 1,
        name: 'Renginys 1',
        attendees: ['Dalyvis 1', 'Dalyvis 2'],
        volunteers: [
        ],
        volunteerRequests: [
            { id: 3, name: 'Savanoris 3' },
            { id: 1, name: 'Savanoris 1' },
            { id: 4, name: 'Savanoris 4' },
            { id: 2, name: 'Savanoris 2' },
        ],
    },
    {
        id: 2,
        name: 'Renginys 2',
        attendees: ['Dalyvis 1', 'Dalyvis 2'],
        volunteers: [
            { id: 1, name: 'Savanoris 1' },
            { id: 2, name: 'Savanoris 2' },
        ],
        volunteerRequests: [
            { id: 3, name: 'Savanoris 3' },
            { id: 4, name: 'Savanoris 4' },
        ],
    },
    {
        id: 3,
        name: 'Renginys 3',
        attendees: ['Dalyvis 1', 'Dalyvis 2'],
        volunteers: [
            { id: 1, name: 'Savanoris 1' },
            { id: 2, name: 'Savanoris 2' },
            { id: 3, name: 'Savanoris 3' },
        ],
        volunteerRequests: [
            { id: 4, name: 'Savanoris 4' },
        ],
    }
]

const getEventById = async (eventId: number): Promise<Event> => {
    return eventsFromBE.find(event => event.id === eventId) as Event;
};

interface EventCardProps {
    eventId: number;
    onAcceptVolunteer: (volunteerId: number) => void;
    onDeclineVolunteer: (volunteerId: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ eventId, onAcceptVolunteer, onDeclineVolunteer }) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

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
        return <div>Loading...</div>;
    }

    const filteredVolunteers = event.volunteerRequests.filter(volunteer =>
        volunteer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAcceptVolunteer = (volunteer: { id: number, name: string }) => {
        setEvent({
            ...event,
            volunteers: [...event.volunteers, volunteer],
            volunteerRequests: event.volunteerRequests.filter(v => v.id !== volunteer.id),
        });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {event.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 5}}>
                    {event.attendees.length} Dalyviai
                </Typography>
                <Typography variant="h6" component="div">
                    {event.attendees.length} Priimti savanoriai
                </Typography>
                <List>
                    {event.volunteers.map(volunteer => (
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
                        <ListItem key={volunteer.id} sx={{gap: 5}}>
                            <ListItemText primary={volunteer.name} />
                            <Button variant="contained" color="success" onClick={() => handleAcceptVolunteer(volunteer)}>Priimti</Button>
                            <Button variant="contained" color="error">Nepriimti</Button>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default EventCard;