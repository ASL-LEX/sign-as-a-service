import { Box, Tabs, Tab, Typography } from '@mui/material';
import { Dispatch, FC, ReactNode, useState, SetStateAction } from 'react';
import { TextSearch } from '../TextSearch/TextSearch.component';
import { Lexicon, LexiconEntry } from '../../graphql/graphql';

export interface ModeSelectorProps {
  lexicon: Lexicon;
  setSearchResults: Dispatch<SetStateAction<LexiconEntry[]>>;
  width: number;
}

export const ModeSelector: FC<ModeSelectorProps> = ({ lexicon, setSearchResults, width }) => {
  const [mode, setMode] = useState<number>(0);

  return (
    <Box sx={{ width }}>
      <Box sx={{ width }}>
        <Tabs value={mode} onChange={(_event, value) => setMode(value)} centered>
          <Tab label='Text Search' />
          <Tab label='Live Video' />
          <Tab label='Upload' />
        </Tabs>
      </Box>

      <TabPanel currentMode={mode} mode={0}>
        <TextSearch lexicon={lexicon} setSearchResults={setSearchResults} width={width} />
      </TabPanel>
      <TabPanel currentMode={mode} mode={1}>
        <Typography variant='body1'>Coming Soon!</Typography>
      </TabPanel>
      <TabPanel currentMode={mode} mode={2}>
        <Typography variant='body1'>Coming Soon!</Typography>
      </TabPanel>
    </Box>
  );
};

interface TabPanelProps {
  children: ReactNode;
  currentMode: number;
  mode: number;
}

const TabPanel: FC<TabPanelProps> = ({ children, currentMode, mode }) => {
  return (
    <Box hidden={currentMode != mode} sx={{ paddingTop: 1 }}>
      {currentMode == mode && children}
    </Box>
  );
};
