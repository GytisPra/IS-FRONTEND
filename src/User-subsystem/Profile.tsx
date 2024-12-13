import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { supabase } from "../../supabase";
import { user } from "../home/user"; 

const ProfileUpdatePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    age: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.email) {
        console.error("No valid user object found.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("name, username, email, age, phone_number")
          .eq("email", user.email)
          .single();

        if (error) {
          console.error("Error fetching user data:", error.message);
          setLoading(false);
          return;
        }

        if (data) {
          setUserData({
            name: data.name || "",
            username: data.username || "",
            email: data.email || "",
            age: data.age || "",
            phoneNumber: data.phone_number || "",
          });
        }
      } catch (err) {
        console.error("Klaida:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: userData.name,
          username: userData.username,
          age: userData.age,
          phone_number: userData.phoneNumber,
        })
        .eq("email", userData.email);

      if (error) {
        console.error("Klaida atnaujinant profili:", error.message);
      } else {
        alert("Profilis atnaujintas sekmingai!");
      }
    } catch (err) {
      console.error("Klaida:", err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
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
          <TextField
            label="Vardas"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Slapyvardis"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="El paštas"
            name="email"
            value={userData.email}
            type="email"
            disabled
            fullWidth
          />
          <TextField
            label="Amžius"
            name="age"
            value={userData.age}
            onChange={handleInputChange}
            type="number"
            fullWidth
          />
          <TextField
            label="Telefono numeris"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleInputChange}
            type="tel"
            fullWidth
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
        >
          Išsaugoti pakeitimus
        </Button>
      </Container>
    </Box>
  );
};

export default ProfileUpdatePage;
