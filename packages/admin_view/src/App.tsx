import { Grid, Stack, Typography } from '@mui/material';
import { ThemeProvider } from './context/ThemeProvider.context';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import CreateLex from './components/CreateLex.tsx';

export const App: React.FC = () => {
  // Link for HTTP requests from client to backend GraphQL server
  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
    headers: { authorization: `Bearer ${import.meta.env.VITE_AUTH_SECRET}` } // TODO real auth
  });
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink
  });

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <Grid container justifyContent="center" gap="10px">
          <Stack gap="20px" alignItems="start">
            <Stack gap="10px" alignItems="start">
              <Typography fontWeight="600">Create Lexicon</Typography>
              <CreateLex />
            </Stack>
          </Stack>
        </Grid>
      </ThemeProvider>
    </ApolloProvider>
  );
};
