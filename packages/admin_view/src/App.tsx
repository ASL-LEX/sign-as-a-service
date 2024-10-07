import { Grid, Typography } from '@mui/material';
import { ThemeProvider } from './context/ThemeProvider.context';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';

export const App: React.FC = () => {
  // Link for HTTP requests from client to backend GraphQL server
  const httpLink = createHttpLink({ uri: import.meta.env.VITE_GRAPHQL_ENDPOINT });
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink
  });

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <Grid container justifyContent="center">
          <Typography variant="h1">Hello World</Typography>
        </Grid>
      </ThemeProvider>
    </ApolloProvider>
  );
};
