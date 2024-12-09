import { Box, Typography } from '@mui/material';
import CreateLex from '../components/CreateLex.tsx';

const CreateLexPage = () => {
  return (
    <Box
      sx={{
        justifySelf: 'center',
        gap: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6">Create Lexicon</Typography>
      <CreateLex />
    </Box>
  );
};

export default CreateLexPage;