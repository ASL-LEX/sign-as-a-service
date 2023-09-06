import type { Meta, StoryObj } from '@storybook/react';
import { SearchResults } from './SearchResults.component';
import { LexiconEntry } from '../../graphql/graphql';
import { useState } from 'react';

const meta: Meta<typeof SearchResults> = {
  title: 'SearchResults View',
  component: SearchResults
};

export default meta;
type Story = StoryObj<typeof SearchResults>;

export const Primary: Story = (args: any) => {
  const options: LexiconEntry[] = [
    {
      key: 'A_01_056',
      primary: 'dog',
      video: 'https://signlab2.s3.amazonaws.com/videos/A_01_056.webm',
      associates: [],
      fields: {},
      lexicon: ''
    },
    {
      key: 'H_02_103',
      primary: 'dog 4',
      video: 'https://signlab2.s3.amazonaws.com/videos/H_02_103.webm',
      associates: [],
      fields: {},
      lexicon: ''
    },
    {
      key: 'J_02_068',
      primary: 'dog 3',
      video: 'https://signlab2.s3.amazonaws.com/videos/J_02_068.webm',
      associates: [],
      fields: {},
      lexicon: ''
    },
    {
      key: 'K_01_055',
      primary: 'dog 2',
      video: 'https://signlab2.s3.amazonaws.com/videos/K_01_055.webm',
      associates: [],
      fields: {},
      lexicon: ''
    }
  ];

  const [value, setValue] = useState<LexiconEntry | null>(null);

  return <SearchResults options={options} value={value} setValue={setValue} {...args} />;
};

Primary.args = {};
