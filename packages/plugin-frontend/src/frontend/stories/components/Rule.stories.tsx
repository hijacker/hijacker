import { Rule } from '../../components/Rule';

import type { Meta, StoryObj } from '@storybook/react';


const meta: Meta<typeof Rule> = {
  title: 'Components/Rule',
  component: Rule,
};

export default meta;
type Story = StoryObj<typeof Rule>;

export const Primary: Story = {
  args: {
    rule: {
      name: 'Test'
    }
  },
};