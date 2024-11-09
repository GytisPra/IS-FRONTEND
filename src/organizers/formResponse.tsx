import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface FormResponseBoxProps {
  response: string;
  onClose: () => void;
}

const FormResponseBox: React.FC<FormResponseBoxProps> = ({
  response,
  onClose,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography id="modal-title" variant="h6" component="h2">
        Google Forms Atsakymai
      </Typography>
      <Typography id="modal-description" sx={{ mt: 2 }}>
        {response}
      </Typography>
      <Button onClick={onClose} sx={{ mt: 2 }}>
        Uždaryti
      </Button>
    </Box>
  );
};

export default FormResponseBox;
