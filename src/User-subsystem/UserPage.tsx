import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Container } from '@mui/material';

const UserPage: React.FC = () => {
    const navigate = useNavigate();

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
            {/* Button positioned in the top right corner */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/update-profile')}
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                }}
            >
                Peržiūrėti profilį
            </Button>

            {/* Centered Card Content */}
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
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center' }}>
                    Čia yra naudotojo puslapis
                </Typography>

                {/* Event Search Section */}
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <Typography variant="h6" component="p" color="text.secondary" sx={{ marginBottom: 1 }}>
                        Kokio renginio ieškote?
                    </Typography>
                    <TextField
                        variant="outlined"
                        placeholder="Search for events"
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default UserPage;
