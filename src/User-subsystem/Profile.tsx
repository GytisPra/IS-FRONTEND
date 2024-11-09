import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Avatar, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const ProfileUpdatePage: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100vw',
                height: '100vh',
                backgroundColor: '#f3f4f6',
                overflow: 'hidden',
            }}
        >
            {/* Sidebar Toggle Button */}
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
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
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

            {/* Go Back Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/user')}
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                }}
            >
                Grįžti į pagrindinį puslapį
            </Button>

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

                {/* Header */}
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center', mb: 4 }}>
                    Mano profilis
                </Typography>

                {/* User Information Form */}
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '100%',
                        mb: 3,
                    }}
                >
                    <TextField label="Vardas" defaultValue="Jonas" fullWidth />
                    <TextField label="Slapyvardis" defaultValue="Jonukas" fullWidth />
                    <TextField label="El paštas" defaultValue="jonas@example.com" type="email" fullWidth />
                    <TextField label="Vietovė" defaultValue="Vilnius" fullWidth />
                    <TextField label="Amžius" defaultValue="30" type="number" fullWidth />
                    <TextField label="Telefono numeris" defaultValue="+370 600 12345" type="tel" fullWidth />
                </Box>

                {/* Update Button */}
                <Button variant="contained" color="primary" fullWidth>
                    Išsaugoti pakeitimus
                </Button>
            </Container>
        </Box>
    );
};

export default ProfileUpdatePage;
