import { Container, Typography, Box, Grid, Paper, Button, Modal, MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { loginWithGoogle, logout } from '../userService';
import { user } from './user';
import {supabase } from '../../supabase';

const teamMembers = [
  { name: 'Gedmantas', role: "Dev'as | Rekvizitai" },
  { name: 'Lukas', role: "Dev'as | Įmonė" },
  { name: 'Gytis', role: "Dev'as | Gelbėtojas" },
  { name: 'Dominykas', role: "Dev'as | Finansininkas" },
  { name: 'Rokas', role: "Dev'as | Visažynis" },
];

const App = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    phoneNumber: '',
  });
  const [signedInEmail, setSignedInEmail] = useState('Not available');
  const [authId, setAuthId] = useState('Not available');
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkFirstTimeLogin = async () => {

      if (!user) {
        console.log('No user is currently signed in.');
        setIsSignedIn(false);
        return;
      }

      if (user.email) {
        setSignedInEmail(user.email);
        setIsSignedIn(true);
        console.log(user)

      

          if (user) {
            const now = new Date();
            const created = new Date(user.created_at);
            const localTime = now;

            const utcNow = new Date(created.getTime() + created.getTimezoneOffset() * 60000);
            const twoHoursLater = new Date(utcNow.getTime() + 2 * 60 * 60 * 1000); 
          
            const timeDifference = Math.abs(localTime.getTime() - twoHoursLater.getTime());
          
            console.log("Local Time:", localTime);
            console.log("Two Hours Later (UTC+2):", twoHoursLater);
            console.log("Time Difference (ms):", timeDifference);
          
            if (timeDifference <= 1000) {
              setShowSignUp(true);
            }
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

  const handleSubmit = async () => {
    if (role === 'user') {
      const { error } = await supabase
        .from('users')
        .insert({
          email: signedInEmail,
          role,
          username: formData.username,
          name: formData.name,
          phone_number: formData.phoneNumber,
          age: formData.age,
        });

      if (error) {
        console.error('Klaida:', error.message);
        return;
      }
      console.log('Sekmingai!');
    }
    setShowSignUp(false);
  };

  return (
    <Container>
  <Box sx={{ textAlign: 'center', my: 4 }}>
    <Typography variant="h1" component="h1" gutterBottom>
      Rangovai
    </Typography>
    <Typography variant="h5" component="h2" gutterBottom>
      Pristato:
    </Typography>
  </Box>

  <Box
    sx={{
      position: 'absolute',
      top: 100,
      right: 20,
      textAlign: 'right',
    }}
  >
    <Typography variant="body1" gutterBottom>
      Prisijunges kaip: {isSignedIn ? signedInEmail : 'Nėra naudotojo'}
    </Typography>
  </Box>

  <Grid container spacing={4} justifyContent="center">
    {teamMembers.map((member, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', height: '100%' }}>
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

  <Box sx={{ textAlign: 'center', my: 4 }}>
    {!isSignedIn && (
      <Button variant="outlined" onClick={loginWithGoogle} sx={{ marginRight: 2 }}>
        Prisijungti su Google
      </Button>
    )}
    {isSignedIn && (
      <Button variant="contained" color="secondary" onClick={logout}>
        Atsijungti
      </Button>
    )}
  </Box>

  {/* Sign-Up Modal */}
  <Modal
    open={showSignUp}
    onClose={() => setShowSignUp(false)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
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
        <MenuItem value="volunteer">Savanorius</MenuItem>
        <MenuItem value="user">Naudotojas</MenuItem>
      </Select>
      {!role && <Typography color="error">Role yra privaloma.</Typography>}

      {role === 'user' && (
        <>
          <TextField
            label="Slapyvardis"
            fullWidth
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            error={!formData.username}
            helperText={!formData.username ? 'Slapyvardis yra privalomas.' : ''}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Vardas"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!formData.name}
            helperText={!formData.name ? 'Vardas yra privalomas.' : ''}
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
            : ''
          }
          sx={{ mb: 2 }}
        />
        <TextField
        label="Amžius"
        fullWidth
        name="age"
        value={formData.age}
        onChange={handleInputChange}
         error={!/^\d+$/.test(formData.age) || formData.age < 1 || formData.age > 120}
        helperText={
          !/^\d+$/.test(formData.age)
          ? 'Amžius turi būti skaičius.'
          
          : ''
        }
  sx={{ mb: 2 }}
/>


        </>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={() => {
          const errors = [];
          if (!role) errors.push('Role yra privaloma.');
          if (!formData.username) errors.push('Slapyvardis yra privalomas.');
          if (!formData.name) errors.push('Vardas yra privalomas.');
          if (!/^\+\d+$/.test(formData.phoneNumber))
            errors.push('Tel. nr turi prasidėti su "+" ir būti tik skaičiai.');
          if (errors.length > 0) {
            alert(errors.join('\n'));
          } else {
            handleSubmit();
          }
        }}
      >
        Registruotis
      </Button>
    </Box>
  </Modal>
</Container>

  

  );
};

export default App;
