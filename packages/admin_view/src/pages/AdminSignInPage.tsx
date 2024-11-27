import { Box, Button, Snackbar, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/use-auth-context.tsx';
import { useSnackbar } from 'notistack';

// TODO Just a placeholder
const AdminSignInPage = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const { login } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const showErrorSnackbar = () => enqueueSnackbar('Error logging in', { variant: 'error', autoHideDuration: 3000 });

  const signIn = async () => {
    if (!email || !password) {
      showErrorSnackbar();
      return;
    }

    login(email, password)
      .then(() => navigate('/'))
      .catch(() => showErrorSnackbar());
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        justifySelf="center"
        width={300}
      >
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
        <Button
          variant="contained"
          color="primary"
          disabled={!email || !password}
          fullWidth
          style={{ marginTop: '16px' }}
          onClick={() => signIn()}
        >
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
