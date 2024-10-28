import { Box, Button, Snackbar, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/use-auth-context.tsx';

// TODO Just a placeholder
const AdminSignInPage = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const { login } = useAuthContext();
  const navigate = useNavigate();

  const signIn = async () => {
    if (!email || !password) {
      setSnackbarOpen(true);
      return;
    }
    try {
      await login(email, password);
      console.log(email, password);
      navigate('/authenticated');
    } catch (error) {
      setSnackbarOpen(true);
      console.error(error);
      return;
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h4" mb={2}>
          Login
        </Typography>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }} onClick={() => signIn()}>
          Login
        </Button>
      </Box>
      <Snackbar
        message="Error logging in"
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
};

export default AdminSignInPage;
