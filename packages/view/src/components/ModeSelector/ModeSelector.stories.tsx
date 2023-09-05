import type { Meta, StoryObj } from '@storybook/react';
import { ModeSelector, ModeSelectorProps } from './ModeSelector.component';
import { useState } from 'react';
import { LexiconEntry } from '../../graphql/graphql';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const meta: Meta<typeof ModeSelector> = {
  title: 'ModeSelector View',
  component: ModeSelector,
};

export default meta;
type Story = StoryObj<typeof ModeSelector>;

export const Primary: Story = (args: any) => {
  const [_searchResults, setSearchResults] = useState<LexiconEntry[]>([]);

  const options: ModeSelectorProps = {
    lexicon: { _id: '64e4e63ecade2ec090d6765e', name: 'ASL-LEX', schema: {}},
    setSearchResults: setSearchResults,
    width: 500
  };

  return (
    <ApolloProvider client={new ApolloClient({ uri: 'https://lex-gateway.sail.codes/graphql', cache: new InMemoryCache() })}>
      <ModeSelector {...options} {...args} />
    </ApolloProvider>
  );
};

Primary.args = {

};
