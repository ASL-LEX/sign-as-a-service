import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { LexiconEntry } from '../../graphql/graphql';
import { Grid, Typography, Paper, List } from '@mui/material';
import { SxProps } from '@mui/material';

interface SearchResultsProps {
  options: LexiconEntry[];
  value: LexiconEntry | null;
  setValue: Dispatch<SetStateAction<LexiconEntry | null>>;
}

export const SearchResults: FC<SearchResultsProps> = ({ options, value, setValue }) => {
  return (
    <Paper sx={{ maxWidth: 600 }} elevation={3}>
      <List sx={{ overflow: 'auto' }}>
        {options.map((lexiconEntry) => {
          return <SearchRow lexiconEntry={lexiconEntry} key={lexiconEntry.key} currentValue={value} setValue={setValue} />
        })}
      </List>
    </Paper>
  );
};

interface SearchRowProps {
  lexiconEntry: LexiconEntry;
  currentValue: LexiconEntry | null;
  setValue: Dispatch<SetStateAction<LexiconEntry | null>>;
}

const SearchRow: FC<SearchRowProps> = ({ lexiconEntry, currentValue, setValue }) => {
  const selectedStyle: SxProps = {
    backgroundColor: 'lightblue'
  };

  // Handle updating the style based on the current value
  const [style, setStyle] = useState<SxProps>({});
  useEffect(() => {
    if (currentValue && currentValue.key == lexiconEntry.key) {
      setStyle(selectedStyle);
    } else {
      setStyle({});
    }
  }, [lexiconEntry, currentValue]);

  return (
    <Grid container alignItems='center' spacing={2} sx={style} onClick={() => setValue(lexiconEntry)}>
      <Grid item>
        <iframe src={lexiconEntry.video} allow='autoplay' />
      </Grid>
      <Grid item>
        <Typography variant='h4'>{lexiconEntry.primary}</Typography>
      </Grid>
    </Grid>
  );
};
