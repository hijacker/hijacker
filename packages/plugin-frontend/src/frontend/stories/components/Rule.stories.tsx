import type { Meta, StoryObj } from '@storybook/react';

import { Rule } from '../../components/Rule';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Rule> = {
  title: 'Components/Rule',
  component: Rule,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {

  },
};

export default meta;
type Story = StoryObj<typeof Rule>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Primary: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    rule: {
      name: 'Test'
    }
  },
};
