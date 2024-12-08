import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { loginWithGoogle, logout, supabase } from '../userService';

const teamMembers = [
  { name: 'Gedmantas', role: "Dev'as | Rekvizitai" },
  { name: 'Lukas', role: "Dev'as | Įmonė" },
  { name: 'Gytis', role: "Dev'as | Gelbėtojas" },
  { name: 'Dominykas', role: "Dev'as | Finansininkas" },
  { name: 'Rokas', role: "Dev'as | Visažynis" },
];

const App = () => {
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
        <button style={{border: '1px solid black', margin: '5px', padding: '10px'}} onClick={loginWithGoogle}>Prisijungti su Google</button>
      </Box>
    </Container>
  );
}

export default App;