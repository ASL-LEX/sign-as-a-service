import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { DropDown } from '../DropDown/DropDown.component';
import { Lexicon, LexiconEntry } from '../../graphql/graphql';
import { useLexFindAllQuery } from '../../graphql/lexicon/lexicon';
import { ModeSelector } from '../ModeSelector/ModeSelector.component';
import { SearchResults } from '../SearchResults/SearchResults.component';

export interface SearchProps {
  value: LexiconEntry | null;
  setValue: Dispatch<SetStateAction<LexiconEntry | null>>;
}

export const Search: FC<SearchProps> = ({ value, setValue }) => {
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
    }
  }, [data]);

  // Handle search selection

  return (
    <Stack>
      <DropDown setValue={setLexicon} options={lexicons} />
      {lexicon && <ModeSelector lexicon={lexicon} setSearchResults={setSearchResults} />}
      {lexicon && searchResults.length > 0 && <SearchResults options={searchResults} value={value} setValue={setValue} />}
    </Stack>
  );
};
