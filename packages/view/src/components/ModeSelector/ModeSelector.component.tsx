import { Box, Tabs, Tab } from '@mui/material';
import { FC, ReactNode, useState } from 'react';
import {TextSearch} from '../TextSearch/TextSearch.component';

interface ModeSelectorProps {

}

export const ModeSelector: FC<ModeSelectorProps> = ({ }) => {
  const [mode, setMode] = useState<number>(0);

  return (
    <Box>
      <Box>
        <Tabs value={mode} onChange={(_event, value) => setMode(value)}>
          <Tab label='Text Search' />
          <Tab label='Live Video' />
          <Tab label='Upload' />
        </Tabs>
      </Box>

      <TabPanel currentMode={mode} mode={0}>
        <TextSearch />
      </TabPanel>
      <TabPanel currentMode={mode} mode={1}>
        <p>Live Video Search</p>
      </TabPanel>
      <TabPanel currentMode={mode} mode={2}>
        <p>Upload Video Search</p>
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
