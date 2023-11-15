
import { withConfig } from '../../.storybook/decorators';
import History from '../../pages/History';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof History> = {
  title: 'Pages/History',
  component: History,
};

export default meta;
type Story = StoryObj<typeof History>;

export const Primary: Story = {
  decorators: [
    withConfig
  ]
};