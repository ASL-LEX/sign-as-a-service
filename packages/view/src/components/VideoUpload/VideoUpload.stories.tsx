import type { Meta, StoryObj } from '@storybook/react';
import { VideoUpload, VideoUploadProps } from './VideoUpload.component';
import { useState } from 'react';
import { LexiconEntry } from '../../graphql/graphql';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const meta: Meta<typeof VideoUpload> = {
  title: 'VideoUpload View',
  component: VideoUpload
};

export default meta;
type Story = StoryObj<typeof VideoUpload>;

export const Primary: Story = (args: any) => {
  const [_searchResults, setSearchResults] = useState<LexiconEntry[]>([]);

  const options: VideoUploadProps = {
    lexicon: { _id: '64b15233e535bc69dc95b92f', name: 'ASL-LEX', schema: {} },
    setSearchResults,
    width: 500
  };

  return (
    <ApolloProvider client={new ApolloClient({ uri: 'http://localhost:3002/graphql', cache: new InMemoryCache() })}>
      <VideoUpload {...options} />
    </ApolloProvider>
  );
};

Primary.args = {};
