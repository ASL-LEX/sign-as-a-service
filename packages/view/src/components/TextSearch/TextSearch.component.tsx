import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { Lexicon, LexiconEntry } from '../../graphql/graphql';
import { useLexiconSearchLazyQuery } from '../../graphql/lexicon/lexicon';

export interface TextSearchProps {
  lexicon: Lexicon;
  setSearchResults: Dispatch<SetStateAction<LexiconEntry[]>>;
};

export const TextSearch: FC<TextSearchProps> = ({ lexicon, setSearchResults }) => {
  const [query, setQuery] = useState<string>('');
  const [lexiconEntryQuery] = useLexiconSearchLazyQuery();

  const updateSearchResults = async (query: string) => {
    const results = await lexiconEntryQuery({ variables: { lexicon: lexicon._id, search: query }});

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
      <TextField label='Lexicon Search' value={query} onChange={(event) => setQuery(event.target.value)} />
    </Box>
  );
};
