import React, { useState } from 'react';
import { Card, CardContent,Grid, Typography, CardActionArea } from '@mui/material';


interface Event {
    id: number;
    name: string;
    startTime: Date;
    attendees: string[];
    description: string;
}

interface EventRowCardProps {
    event: Event;
    height: number;
    button?: React.ReactNode;
    onClick?: () => void;
}

const EventRowCard: React.FC<EventRowCardProps> = ({ event, height, button, onClick }) => {
    const content = (
      <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={3}>
            <Typography variant="h6" component="div">
              {event.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event.startTime.toDateString()}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="body2" color="text.secondary">
              {event.description}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" color="text.secondary">
              {event.attendees.length} Dalyviai
            </Typography>
          </Grid>
        </Grid>
        {button && (
          <Grid item xs={12}>
            {button}
          </Grid>
        )}
      </CardContent>
    );
  
    return (
      <Card sx={{ height, border: '1px solid blue', marginBottom: 3 }}>
        {button ? (
          content
        ) : (
          <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
            {content}
          </CardActionArea>
        )}
      </Card>
    );
  };
  
  export default EventRowCard;