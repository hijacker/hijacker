import type { Meta, StoryObj } from '@storybook/react';

import { withConfig } from '../../.storybook/decorators';
import History from '../../pages/History';

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