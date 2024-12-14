import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Modal,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import emailjs from "emailjs-com";
import { loginWithGoogle, logout } from "../userService";
import { user } from "./user";
import { supabase } from "../../supabase";

const teamMembers = [
  { name: "Gedmantas", role: "Dev'as | Rekvizitai" },
  { name: "Lukas", role: "Dev'as | Įmonė" },
  { name: "Gytis", role: "Dev'as | Gelbėtojas" },
  { name: "Dominykas", role: "Dev'as | Finansininkas" },
  { name: "Rokas", role: "Dev'as | Visažynis" },
];

const App = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    phoneNumber: "",
    age: "",
  });
  const [signedInEmail, setSignedInEmail] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const email = queryParams.get("email");
      const verified = queryParams.get("verified");

      if (email) {
        console.log(`Attempting to verify email: ${email}`);
        try {
          const { data, error } = await supabase
            .from("users")
            .update({ is_email_verified: true })
            .eq("email", email);

          if (error) {
            console.error("Error updating is_email_verified:", error.message);
            alert("Nepavyko patvirtinti el. pašto.");
          } else if (data.length === 0) {
            console.warn("No user found with this email:", email);
            alert("Tokio vartotojo nera.");
          } else {
            console.log("El. paštas patvirtintas sėkmingai:", data);
            setShowNotification(true);
          }
        } catch (error) {
          console.error("Klaida:", error.message);
        }
      }

      if (verified === "true") {
        setShowNotification(true);
      }
    };

    verifyEmail();
  }, [location]);

  useEffect(() => {
    if (showNotification) {
      console.log("Notification is being displayed.");
    }
  }, [showNotification]);

  useEffect(() => {
    const checkFirstTimeLogin = async () => {
      if (!user) {
        console.log("No user is currently signed in.");
        setIsSignedIn(false);
        return;
      }

      if (user.email) {
        setSignedInEmail(user.email);
        setIsSignedIn(true);

        const now = new Date();
        const created = new Date(user.created_at);
        const localTime = now;

        const utcNow = new Date(
          created.getTime() + created.getTimezoneOffset() * 60000
        );
        const twoHoursLater = new Date(utcNow.getTime() + 2 * 60 * 60 * 1000);

        const timeDifference = Math.abs(
          localTime.getTime() - twoHoursLater.getTime()
        );
        console.log(timeDifference);
        if (timeDifference <= 40000) {
          setShowSignUp(true);
        }
      }
    };

    checkFirstTimeLogin();
  }, []);

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRole(event.target.value as string);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendEmail = async (toEmail: string) => {
    try {
      const templateParams = {
        to_email: toEmail,
        confirm_url: `http://localhost:5173/?email=${toEmail}&verified=true`,
      };

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID, // Service ID
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // Template ID
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY // Public Key
      );

      console.log("Email sent successfully:", response.text);
      alert("Registracijos patvirtinimas iššiųstas į Jūsų paštą.");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Nepavyko išsiųsti patvirtinimo laiško.");
    }
  };

  const handleSubmit = async () => {
    if (
      !role ||
      !formData.username ||
      !formData.name ||
      !formData.phoneNumber ||
      !formData.age
    ) {
      alert("Supildykite visus laukus.");
      return;
    }

    try {
      await sendEmail(signedInEmail);

      const { data, error: dbError } = await supabase.from("users").insert({
        email: signedInEmail,
        role,
        username: formData.username,
        name: formData.name,
        phone_number: formData.phoneNumber,
        age: formData.age,
        is_email_verified: false,
      });

      if (dbError) {
        console.error("Error saving user data:", dbError.message);
      } else {
        console.log("User data saved successfully:", data);
        alert(
          "Sėkmingai užsiregistravote sistemoje. Į elektroninį paštą išsiuntėme registracijos patvirtinimą."
        );
        setShowSignUp(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  return (
    <Container>
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Rangovai
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Pristato:
        </Typography>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 100,
          right: 20,
          textAlign: "right",
        }}
      >
        <Typography variant="body1" gutterBottom>
          Prisijunges kaip: {isSignedIn ? signedInEmail : "Nėra naudotojo"}
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{ padding: 2, textAlign: "center", height: "100%" }}
            >
              <Typography variant="h6" component="h3">
                {member.name}
              </Typography>
              <Typography variant="body1" component="p">
                {member.role}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: "center", my: 4 }}>
        {!isSignedIn && (
          <Button
            variant="outlined"
            onClick={loginWithGoogle}
            sx={{ marginRight: 2 }}
          >
            Prisijungti su Google
          </Button>
        )}
        {isSignedIn && (
          <Button variant="contained" color="secondary" onClick={logout}>
            Atsijungti
          </Button>
        )}
      </Box>

      <Modal
        open={showSignUp}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Registracija
          </Typography>
          <Select
            fullWidth
            value={role}
            onChange={handleRoleChange}
            sx={{ mb: 2 }}
            displayEmpty
            error={!role}
          >
            <MenuItem value="" disabled>
              Pasirinkite Role
            </MenuItem>
            <MenuItem value="admin">Administratorius</MenuItem>
            <MenuItem value="volunteer">Savanoris</MenuItem>
            <MenuItem value="user">Naudotojas</MenuItem>
          </Select>
          {!role && <Typography color="error">Rolė yra privaloma.</Typography>}

          <TextField
            label="Slapyvardis"
            fullWidth
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            error={!formData.username}
            helperText={!formData.username ? "Slapyvardis yra privalomas." : ""}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Vardas"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!formData.name}
            helperText={!formData.name ? "Vardas yra privalomas." : ""}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Tel. nr"
            fullWidth
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            error={!/^\+\d+$/.test(formData.phoneNumber)}
            helperText={
              !/^\+\d+$/.test(formData.phoneNumber)
                ? 'Tel. nr turi prasidėti su "+" ir būti tik skaičiai.'
                : ""
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Amžius"
            fullWidth
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            error={!/^\d+$/.test(formData.age)}
            helperText={
              !/^\d+$/.test(formData.age) ? "Amžius turi būti skaičius." : ""
            }
            sx={{ mb: 2 }}
          />

          <Button variant="contained" fullWidth onClick={handleSubmit}>
            Registruotis
          </Button>
        </Box>
      </Modal>

      <Modal
        open={showNotification} // Show notification modal
        onClose={() => setShowNotification(false)}
        aria-labelledby="notification-modal-title"
        aria-describedby="notification-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography
            id="notification-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Sėkmingai patvirtinote el. paštą!
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowNotification(false)}
          >
            Gerai
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default App;
