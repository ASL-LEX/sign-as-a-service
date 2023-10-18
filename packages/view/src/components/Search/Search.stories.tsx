import type { Meta, StoryObj } from '@storybook/react';
import { Search, SearchProps } from './Search.component';
import { useState } from 'react';
import { LexiconEntry } from '../../graphql/graphql';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const meta: Meta<typeof Search> = {
  title: 'Search View',
  component: Search
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Primary: Story = (_args: any) => {
  const [value, setValue] = useState<LexiconEntry | null>(null);

  const options: SearchProps = {
    value,
    setValue,
    width: 500
  };

  return (
    <ApolloProvider client={new ApolloClient({ uri: 'http://localhost:3002/graphql', cache: new InMemoryCache() })}>
      <Search {...options} defaultLexiconName="ASL-LEX" />
    </ApolloProvider>
  );
};

Primary.args = {};
