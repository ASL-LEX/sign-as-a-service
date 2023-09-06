import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Paper, Stack } from '@mui/material';
import { DropDown } from '../DropDown/DropDown.component';
import { Lexicon, LexiconEntry } from '../../graphql/graphql';
import { useLexFindAllQuery } from '../../graphql/lexicon/lexicon';
import { ModeSelector } from '../ModeSelector/ModeSelector.component';
import { SearchResults } from '../SearchResults/SearchResults.component';

export interface SearchProps {
  value: LexiconEntry | null;
  setValue: Dispatch<SetStateAction<LexiconEntry | null>>;
  width: number;
  defaultLexiconName?: string;
}

export const Search: FC<SearchProps> = ({ value, setValue, width, defaultLexiconName }) => {
  // Currently selected lexicon
  const [lexicon, setLexicon] = useState<Lexicon | null>(null);

  // Search results
  const [searchResults, setSearchResults] = useState<LexiconEntry[]>([]);

  // Handle querying for lexicons
  const [lexicons, setLexicons] = useState<Lexicon[]>([]);
  const { data } = useLexFindAllQuery();
  useEffect(() => {
    if (data) {
      setLexicons(data.lexFindAll);

      // If a default lexicon is provided, set that to the active lexicon
      if (defaultLexiconName) {
        setLexicon(data.lexFindAll.find((lexicon) => lexicon.name == defaultLexiconName) || null);
      }
    }
  }, [data]);

  return (
    <Paper elevation={3} sx={{ width: width + 10, padding: 1 }}>
      <Stack>
        <DropDown setValue={setLexicon} options={lexicons} width={width} value={lexicon} />
        {lexicon && <ModeSelector lexicon={lexicon} setSearchResults={setSearchResults} width={width} />}
        {lexicon && searchResults.length > 0 && <SearchResults options={searchResults} value={value} setValue={setValue} width={width} />}
      </Stack>
    </Paper>
  );
};
