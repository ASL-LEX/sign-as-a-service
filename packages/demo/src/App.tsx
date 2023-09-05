import { Banner } from './components/Banner.component';
import { ThemeProvider } from './theme/Theme.provider';
import './App.css';
import { Search } from '@bu-sail/saas-view';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

function App() {
  return (
    <ThemeProvider>
      <ApolloProvider client={new ApolloClient({ uri: import.meta.env.VITE_GRAPHQL, cache: new InMemoryCache() })}>
        <Banner />
        <Search />
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
