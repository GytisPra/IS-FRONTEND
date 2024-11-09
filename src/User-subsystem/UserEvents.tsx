import React, { useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Container, Divider, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const UserEvents: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    const events = [
        { name: 'Birthday Party', date: '2024-11-15', description: 'A fun birthday celebration with friends and family.' },
        { name: 'Workshop on React', date: '2024-12-01', description: 'An informative workshop on React and modern web development.' },
        { name: 'Christmas Gala', date: '2024-12-25', description: 'A formal Christmas event with music, food, and festivities.' },
        { name: 'New Year Bash', date: '2025-01-01', description: 'Celebrate the New Year with a grand party and fireworks.' },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100vw',
                height: '100vh',
                backgroundColor: '#f3f4f6',
                position: 'relative',
            }}
        >
            {/* Sidebar Toggle Button in Top Right */}
            <IconButton
                onClick={toggleDrawer(true)}
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 10,
                }}
            >
                <MenuIcon />
            </IconButton>

            {/* Drawer Sidebar */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                    <List>
                        <ListItemButton onClick={() => navigate('/update-profile')}>
                            <ListItemText primary="My Profile" />
                        </ListItemButton>
                        <ListItemButton onClick={() => navigate('/my-events')}>
                            <ListItemText primary="My Events" />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>

            {/* Events List Centered */}
            <Container
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>My Events</Typography>
                <List sx={{ width: '100%' }}>
                    {events.map((event, index) => (
                        <Box key={index}>
                            <ListItemButton>
                                <ListItemText
                                    primary={event.name}
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.secondary">Date: {event.date}</Typography>
                                            <Typography variant="body2" color="text.secondary">{event.description}</Typography>
                                        </>
                                    }
                                />
                            </ListItemButton>
                            {index < events.length - 1 && <Divider />}
                        </Box>
                    ))}
                </List>
            </Container>
        </Box>
    );
};

export default UserEvents;
