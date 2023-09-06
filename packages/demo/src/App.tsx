import { Banner } from './components/Banner.component';
import { ThemeProvider } from './theme/Theme.provider';
import './App.css';
import { Search } from '@bu-sail/saas-view';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { useState } from 'react';
import { Stack } from '@mui/material';

function App() {
  const [value, setValue] = useState<any>(null);

  return (
    <ThemeProvider>
      <ApolloProvider client={new ApolloClient({ uri: import.meta.env.VITE_GRAPHQL, cache: new InMemoryCache() })}>
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', width: '100%' }} direction='column'>
          <Banner />
            <Search value={value} setValue={setValue} width={500} defaultLexiconName='ASL-LEX'/>
        </Stack>
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
