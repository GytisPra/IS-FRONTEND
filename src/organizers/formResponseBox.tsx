import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { getUser } from "./api";
import FormModal from "./formModal";

interface FormResponseBoxProps {
  formUrl?: string;
  userId: string;
  onClose: () => void;
}

const FormResponseBox: React.FC<FormResponseBoxProps> = ({
  formUrl,
  userId,
  onClose,
}) => {
  const [user, setUser] = React.useState<any>();

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(userId);

      setUser(user);
    };

    fetchUser();
  }, [userId]);


  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 700,
        bgcolor: "background.paper",
        border: "2px solid #000",
        overflow: "auto",
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography id="modal-title" variant="h6" component="h2">
        Google Forms
      </Typography>
      <Typography id="modal-description" sx={{ mt: 2 }}>
        Savanorio el. paštas: {user?.email}
        <br />
        Atsakymą galite rasti <a style={{ textDecoration: "underline"}} href={formUrl}>Google Forms puslapyje</a>
      </Typography>
      <Button onClick={onClose} sx={{ mt: 2 }}>
        Uždaryti
      </Button>
    </Box>
  );
};

export default FormResponseBox;
