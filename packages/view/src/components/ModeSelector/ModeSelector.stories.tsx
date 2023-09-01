import type { Meta, StoryObj } from '@storybook/react';
import { ModeSelector } from './ModeSelector.component';
import { useState } from 'react';
import { Lexicon } from '../../graphql/graphql';

const meta: Meta<typeof ModeSelector> = {
  title: 'ModeSelector View',
  component: ModeSelector,
};

export default meta;
type Story = StoryObj<typeof ModeSelector>;

export const Primary: Story = (args: any) => {
  const [value, setValue] = useState<Lexicon | null>(null);

  const options: Lexicon[] = [
    { _id: '1', name: 'ASL-LEX', schema: {}},
    { _id: '2', name: 'LSE-LEX', schema: {}}
  ];

  return (
    <ModeSelector value={value} setValue={setValue} options={options} {...args} />
  );
};

Primary.args = {

};
