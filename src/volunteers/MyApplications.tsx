// src/my-applications/MyApplications.tsx

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
// import clsx from 'clsx'; // Naudojamas klasėms sujungti, jei reikia

// Apibrėžkite TypeScript sąsają (interface) savo aplikacijoms
interface Application {
    id: number;
    eventName: string;
    submissionDate: string;
    status: 'Pateikta' | 'Patvirtinta' | 'Atšaukta';
}

const MyApplications: React.FC = () => {
    // Hardcoded aplikacijų sąrašas
    const [applications, setApplications] = useState<Application[]>([
        {
            id: 1,
            eventName: 'Renginys A',
            submissionDate: '2024-11-01',
            status: 'Pateikta',
        },
        {
            id: 2,
            eventName: 'Renginys B',
            submissionDate: '2024-11-05',
            status: 'Patvirtinta',
        },
        {
            id: 3,
            eventName: 'Renginys C',
            submissionDate: '2024-11-10',
            status: 'Pateikta',
        },
    ]);

    // State atsisakymo dialogui
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

    // State Snackbar pranešimui
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    // Atidaryti atsisakymo dialogą
    const handleCancelClick = (appId: number) => {
        setSelectedAppId(appId);
        setOpenDialog(true);
    };

    // Patvirtinti atsisakymą
    const handleConfirmCancel = () => {
        if (selectedAppId !== null) {
            setApplications(prevApps =>
                prevApps.map(app =>
                    app.id === selectedAppId ? { ...app, status: 'Atšaukta' } : app
                )
            );
            setSnackbar({
                open: true,
                message: 'Aplikacija sėkmingai atšaukta!',
                severity: 'success',
            });
        }
        setOpenDialog(false);
        setSelectedAppId(null);
    };

    // Atšaukti atsisakymo veiksmą
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAppId(null);
    };

    // Uždaryti Snackbar
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Funkcija nustatyti statuso spalvą
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Patvirtinta':
                return 'text-green-600';
            case 'Atšaukta':
                return 'text-red-600';
            default:
                return 'text-yellow-600';
        }
    };

    return (
        <Container className="py-8">
            <Typography variant="h4" gutterBottom className="text-center mb-6">
                Mano Savanorystės Aplikacijos
            </Typography>

            <TableContainer component={Paper} className="shadow-lg">
                <Table>
                    <TableHead className="bg-gray-200">
                        <TableRow>
                            <TableCell className="font-semibold">ID</TableCell>
                            <TableCell className="font-semibold">Renginio Pavadinimas</TableCell>
                            <TableCell className="font-semibold">Pateikimo Data</TableCell>
                            <TableCell className="font-semibold">Būsena</TableCell>
                            <TableCell className="font-semibold">Veiksmai</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map(app => (
                            <TableRow key={app.id} className="hover:bg-gray-100">
                                <TableCell>{app.id}</TableCell>
                                <TableCell>{app.eventName}</TableCell>
                                <TableCell>{app.submissionDate}</TableCell>
                                {/* <TableCell className={clsx(getStatusColor(app.status), 'font-medium')}>
                                    {app.status}
                                </TableCell> */}
                                <TableCell>
                                    {app.status === 'Pateikta' && (
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleCancelClick(app.id)}
                                            className="border-red-500 text-red-500 hover:bg-red-100"
                                        >
                                            Atsaukti
                                        </Button>
                                    )}
                                    {app.status === 'Patvirtinta' && (
                                        <Typography variant="body2" className="text-green-600 font-semibold">
                                            Patvirtinta
                                        </Typography>
                                    )}
                                    {app.status === 'Atšaukta' && (
                                        <Typography variant="body2" className="text-red-600 font-semibold">
                                            Atšaukta
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Atsisakymo dialogas */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="cancel-dialog-title"
                aria-describedby="cancel-dialog-description"
            >
                <DialogTitle id="cancel-dialog-title">Atsisakyti Aplikacijos</DialogTitle>
                <DialogContent>
                    <DialogContentText id="cancel-dialog-description">
                        Ar tikrai norite atšaukti šią savanorystės aplikaciją?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" variant="contained">
                        Ne
                    </Button>
                    <Button onClick={handleConfirmCancel} color="secondary" variant="contained" autoFocus>
                        Taip
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar pranešimas */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );

};

export default MyApplications;
