import { useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useLexCreateMutation } from '../graphql/lexicon/lexicon.ts';
import { useSnackbar } from 'notistack';

// Eventually going to let the user input this
const DEFAULT_LEX_SCHEMA = {
  type: 'object',
  properties: { english: { type: 'string' } },
  required: [],
  additionalProperties: false
};

const CreateLex = () => {
  const [name, setName] = useState<string>();
  const [createLex, { loading }] = useLexCreateMutation();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Stack>
      <TextField label="Lexicon name" value={name} onChange={({ target }) => setName(target.value)} />
      <Button
        disabled={!name || loading}
        onClick={() => {
          if (name) {
            createLex({ variables: { lexicon: { name, schema: DEFAULT_LEX_SCHEMA } } })
              .then(({ data, errors }) => {
                setName('');
                if (data) {
                  enqueueSnackbar('Lexicon created', {
                    variant: 'success',
                    autoHideDuration: 3000
                  });
                  return;
                }
                if (errors)
                  errors.map(({ message }) =>
                    enqueueSnackbar(message, {
                      variant: 'error',
                      autoHideDuration: 3000
                    })
                  );
              })
              .catch(() =>
                enqueueSnackbar('Error creating lexicon', {
                  variant: 'error',
                  autoHideDuration: 3000
                })
              );
          }
        }}
      >
        <Typography>Submit</Typography>
      </Button>
    </Stack>
  );
};

export default CreateLex;
