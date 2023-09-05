import type { Meta, StoryObj } from '@storybook/react';
import { TextSearch } from './TextSearch.component';
import { useState } from 'react';
import { Lexicon } from '../../graphql/graphql';

const meta: Meta<typeof TextSearch> = {
  title: 'TextSearch View',
  component: TextSearch,
};

export default meta;
type Story = StoryObj<typeof TextSearch>;

export const Primary: Story = (args: any) => {
  const [value, setValue] = useState<Lexicon | null>(null);

  const options: Lexicon[] = [
    { _id: '1', name: 'ASL-LEX', schema: {}},
    { _id: '2', name: 'LSE-LEX', schema: {}}
  ];

  return (
    <TextSearch value={value} setValue={setValue} options={options} {...args} />
  );
};

Primary.args = {

};
