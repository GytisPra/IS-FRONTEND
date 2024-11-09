// src/components/VolunteerEventDetail.tsx

import React from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { Event } from '../components/common/eventRowCard'; // Adjust the import path accordingly

interface VolunteerEventDetailProps {
    event: Event; // Expecting the full event object
    onApply: (eventId: number) => void;
}

const VolunteerEventDetail: React.FC<VolunteerEventDetailProps> = ({ event, onApply }) => {
    const handleApply = () => {
        onApply(event.id);
    };

    return (
        <Card  sx={{ marginBottom: 2, padding: 2, border: '1px solid green' }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {event.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ marginY: 2 }}>
                    {event.description}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="body2">
                            <strong>Pradžios laikas:</strong> {event.startTime.toDateString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">
                            <strong>Dalyviai:</strong> {event.attendees.length}
                        </Typography>
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                    onClick={handleApply}
                >
                    Apply to Volunteer
                </Button>
            </CardContent>
        </Card>
    );
};

export default VolunteerEventDetail;
