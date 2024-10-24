import { useEffect, useState } from 'react';
import { Button, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useLexCreateMutation } from '../graphql/lexicon/lexicon.ts';

// Eventually going to let the user input this
const DEFAULT_LEX_SCHEMA = {
  type: 'object',
  properties: { english: { type: 'string' } },
  required: [],
  additionalProperties: false
};

const CreateLex = () => {
  const [name, setName] = useState<string>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [createLex, { loading, error, data }] = useLexCreateMutation();

  useEffect(() => {
    if (data || error) {
      setSnackbarOpen(true);
    }
  }, [data, error]);

  return (
    <Stack>
      <TextField label="Lexicon name" value={name} onChange={({ target }) => setName(target.value)} />
      <Button
        disabled={!name || loading}
        onClick={() => {
          if (name) {
            createLex({ variables: { lexicon: { name, schema: DEFAULT_LEX_SCHEMA } } }).then(() => setName(''));
          }
        }}
      >
        <Typography>Submit</Typography>
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={error ? 'Error creating lexicon' : `Created lexicon ${name}`}
        ContentProps={{
          sx: {
            backgroundColor: error ? 'red' : 'green'
          }
        }}
      />
    </Stack>
  );
};

export default CreateLex;
