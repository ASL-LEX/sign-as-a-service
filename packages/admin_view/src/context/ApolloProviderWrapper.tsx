import { ReactNode } from 'react';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { useAuthContext } from './use-auth-context.tsx';

const ApolloProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { token } = useAuthContext();
  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
    headers: { authorization: `Bearer ${token}` }
  });
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink
  });
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
