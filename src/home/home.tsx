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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const email = queryParams.get("email");

      if (!email) return;

      console.log(`Attempting to verify email: ${email}`);
      try {
        const { data, error } = await supabase
          .from("users")
          .update({ is_email_verified: true })
          .eq("email", email)
          .select("*");

        if (error) {
          console.error("Error updating is_email_verified:", error.message);
        } else if (!data || data.length === 0) {
          console.warn("No user found with this email:", email);
        } else {
          console.log("El. paštas patvirtintas sėkmingai:", data);
          setShowNotification(true);

          const newUrl = window.location.pathname;
          window.history.replaceState(null, "", newUrl);
        }
      } catch (error) {
        console.error("Klaida:", error.message);
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
      if (!user || !user.email) {
        console.log("No user is currently signed in or no email is available.");
        setIsSignedIn(false);
        return;
      }

      // User is signed in
      setSignedInEmail(user.email);
      setIsSignedIn(true);

      try {
        // Check if this email exists in the 'users' table
        const { data, error } = await supabase
          .from("users")
          .select("email")
          .eq("email", user.email);

        if (error) {
          console.error("Error checking user existence:", error.message);
          return;
        }

        // If no record found, the user is new
        if (data.length === 0) {
          setShowSignUp(true);
        }
      } catch (err) {
        console.error("Unexpected error:", err.message);
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
      toast.success("Registracijos patvirtinimas išsiųstas į Jūsų paštą.");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Nepavyko išsiųsti patvirtinimo laiško.");
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
      toast.error("Supildykite visus laukus.");
      return;
    }

    try {
      setLoading(true);
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
        toast.error("Nepavyko išsaugoti naudotojo duomenų.");
      } else {
        console.log("User data saved successfully:", data);
        toast.success(
          "Sėkmingai užsiregistravote sistemoje. Patikrinkite el. paštą patvirtinimui."
        );
        setShowSignUp(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
      toast.error("Įvyko klaida registracijos metu. Bandykite vėliau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />

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
        onClose={() => setShowSignUp(false)}
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

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Registruojama..." : "Registruotis"}
          </Button>
        </Box>
      </Modal>

      <Modal
        open={showNotification}
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
