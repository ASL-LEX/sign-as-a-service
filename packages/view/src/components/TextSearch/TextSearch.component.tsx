import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { Lexicon, LexiconEntry } from '../../graphql/graphql';
import { useLexiconSearchLazyQuery } from '../../graphql/lexicon/lexicon';

export interface TextSearchProps {
  lexicon: Lexicon;
  setSearchResults: Dispatch<SetStateAction<LexiconEntry[]>>;
  width: number;
}

export const TextSearch: FC<TextSearchProps> = ({ lexicon, setSearchResults, width }) => {
  const [query, setQuery] = useState<string>('');
  const [lexiconEntryQuery] = useLexiconSearchLazyQuery();

  const updateSearchResults = async (query: string) => {
    if (query.length == 0) {
      setSearchResults([]);
      return;
    }

    const results = await lexiconEntryQuery({ variables: { lexicon: lexicon._id, search: query } });

    // TODO: Error handling
    if (results.data) {
      setSearchResults(results.data.lexiconSearch);
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => updateSearchResults(query), 500);
    return () => clearTimeout(timeOutId);
  }, [query]);

  return (
    <Box>
      <TextField label="Lexicon Search" value={query} onChange={(event) => setQuery(event.target.value)} sx={{ width }} inputProps={{ style: { textAlign: 'center' } }} />
    </Box>
  );
};
