import type { Meta, StoryObj } from '@storybook/react';
import { DropDown } from './DropDown.component';

const meta: Meta<typeof DropDown> = {
  title: 'DropDown View',
  component: DropDown,
};

export default meta;
type Story = StoryObj<typeof DropDown>;

export const Primary: Story = (args: any) => <DropDown {...args} />;
Primary.args = {

};
