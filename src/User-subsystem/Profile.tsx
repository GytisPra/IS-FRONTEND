import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";

export const ProfileUpdatePage = () => (
  <Box
    sx={{
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100vh",
      backgroundColor: "#f3f4f6",
      overflow: "hidden",
    }}
  >

    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* Header */}
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: "bold",
          color: "text.primary",
          textAlign: "center",
          mb: 4,
        }}
      >
        Mano profilis
      </Typography>

      {/* User Information Form */}
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          mb: 3,
        }}
      >
        <TextField label="Vardas" defaultValue="Jonas" fullWidth />
        <TextField label="Slapyvardis" defaultValue="Jonukas" fullWidth />
        <TextField
          label="El paštas"
          defaultValue="jonas@example.com"
          type="email"
          fullWidth
        />
        <TextField label="Vietovė" defaultValue="Vilnius" fullWidth />
        <TextField label="Amžius" defaultValue="30" type="number" fullWidth />
        <TextField
          label="Telefono numeris"
          defaultValue="+370 600 12345"
          type="tel"
          fullWidth
        />
      </Box>

      {/* Update Button */}
      <Button variant="contained" color="primary" fullWidth>
        Išsaugoti pakeitimus
      </Button>
    </Container>
  </Box>
);

export default ProfileUpdatePage;