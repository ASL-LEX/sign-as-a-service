import type { Meta, StoryObj } from '@storybook/react';
import { Search, SearchProps } from './Search.component';
import { useState } from 'react';
import { LexiconEntry } from '../../graphql/graphql';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const meta: Meta<typeof Search> = {
  title: 'Search View',
  component: Search,
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Primary: Story = (_args: any) => {
  const [value, setValue] = useState<LexiconEntry | null>(null);

  const options: SearchProps = {
    value,
    setValue
  };

  return (
    <ApolloProvider client={new ApolloClient({ uri: 'https://lex-gateway.sail.codes/graphql', cache: new InMemoryCache() })}>
      <Search {...options} />
    </ApolloProvider>
  );
};

Primary.args = {

};
