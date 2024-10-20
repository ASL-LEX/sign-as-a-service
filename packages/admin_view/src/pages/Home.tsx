import { Button, Grid, Stack, Typography } from '@mui/material';
import CreateLex from '../components/CreateLex.tsx';
import { useAuthContext } from '../context/use-auth-context.tsx';
import LexiconTable from '../components/LexiconTable.tsx';

const Home = () => {
  const { logout } = useAuthContext();
  return (
    <Grid container justifyContent="center" gap="10px">
      <Stack gap="20px" alignItems="start">
        <Stack gap="10px" alignItems="start">
          <Typography fontWeight="600">Create Lexicon</Typography>
          <CreateLex />
          <Button onClick={() => logout()}>Logout</Button>
          <LexiconTable />
        </Stack>
      </Stack>
    </Grid>
  );
};

export default Home;
