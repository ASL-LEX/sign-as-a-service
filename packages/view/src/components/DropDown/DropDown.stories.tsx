import type { Meta, StoryObj } from '@storybook/react';
import { DropDown } from './DropDown.component';
import { useState } from 'react';
import { Lexicon } from '../../graphql/graphql';

const meta: Meta<typeof DropDown> = {
  title: 'DropDown View',
  component: DropDown,
};

export default meta;
type Story = StoryObj<typeof DropDown>;

export const Primary: Story = (args: any) => {
  const [value, setValue] = useState<Lexicon | null>(null);

  const options: Lexicon[] = [
    { _id: '1', name: 'ASL-LEX', schema: {}},
    { _id: '2', name: 'LSE-LEX', schema: {}}
  ];

  return (
    <DropDown value={value} setValue={setValue} options={options} width={500} {...args} />
  );
};

Primary.args = {

};
