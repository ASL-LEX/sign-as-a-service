import type { Meta, StoryObj } from '@storybook/react';
import { TextSearch, TextSearchProps } from './TextSearch.component';
import { useState } from 'react';
import { LexiconEntry } from '../../graphql/graphql';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const meta: Meta<typeof TextSearch> = {
  title: 'TextSearch View',
  component: TextSearch
};

export default meta;
type Story = StoryObj<typeof TextSearch>;

export const Primary: Story = (_args: any) => {
  const [_searchResults, setSearchResults] = useState<LexiconEntry[]>([]);

  const options: TextSearchProps = {
    lexicon: { _id: '64e4e63ecade2ec090d6765e', name: 'ASL-LEX', schema: {} },
    setSearchResults,
    width: 500
  };

  return (
    <ApolloProvider client={new ApolloClient({ uri: 'https://lex-gateway.sail.codes/graphql', cache: new InMemoryCache() })}>
      <TextSearch {...options} />
    </ApolloProvider>
  );
};

Primary.args = {};
