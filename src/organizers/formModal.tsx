import React, { useEffect, useState } from 'react';
import { Modal, Button, Box, Typography } from '@mui/material';

interface FormModalProps {
    children: React.ReactNode;
    formUrl: string;
}

const FormModal: React.FC<FormModalProps> = ({ children, formUrl }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [urlId, setUrlId] = useState('');


    const getUrlId = (url: string) => {
        const urlParts = url.split('/');
        const urlId = urlParts[urlParts.length - 2];
        return urlId;
    };

    useEffect(() => {
        const urlId = getUrlId(formUrl);
        setUrlId(urlId);
    }, [formUrl]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <div onClick={showModal} style={{ cursor: 'pointer' }}>
                {children}
            </div>
            <Modal
                open={isModalVisible}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                    <Typography id="modal-title" variant="h6" component="h2" sx={{marginBottom: '10px'}}>
                        Google Form
                    </Typography>
                    <Typography id="modal-title" sx={{marginBottom: '50px'}} >
                        Rekomenuodajama jei įmanoma, formoje pateikti el. paštą, kurį naudojote prisijungdami prie šios platformos,
                        kad organizatoriai galėtų patogiau susisiekti su Jumis.
                    </Typography>
                    <iframe
                        src={`https://docs.google.com/forms/d/e/${urlId}/viewform?embedded=true`}
                        width="700"
                        height="600"
                        margin-height="0"
                        margin-width="0">
                        Įkeliama…
                    </iframe>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={handleClose} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleClose}>
                            OK
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default FormModal;