import { Stack, Typography } from '@mui/material';
import LexiconTable from '../components/LexiconTable.tsx';
import { useMemo, useState } from 'react';
import { Lexicon } from '../graphql/graphql.ts';
import { useLexFindAllQuery } from '../graphql/lexicon/lexicon.ts';
import { DropDown } from '@bu-sail/saas-view';

const HomePage = () => {
  const [lexicon, setLexicon] = useState<Lexicon | null>(null);

  const { data, loading } = useLexFindAllQuery();
  const lexicons = useMemo(() => data?.lexFindAll || [], [data]);

  return (
    <Stack
      gap="10px"
      alignItems="start"
      sx={{
        width: '100%'
      }}
    >
      <Typography variant="h6">Select a Lexicon</Typography>
      <DropDown setValue={setLexicon} options={lexicons} width={200} value={lexicon} />
      {lexicon && <LexiconTable loading={loading} lexiconId={lexicon._id} />}
    </Stack>
  );
};

export default HomePage;
