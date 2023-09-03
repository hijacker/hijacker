import type { Meta, StoryObj } from '@storybook/react';

import { HomePage } from '../../pages/HomePage';
import { withConfig } from '../../.storybook/decorators';

const meta: Meta<typeof HomePage> = {
  title: 'Pages/HomePage',
  component: HomePage,
};

export default meta;
type Story = StoryObj<typeof HomePage>;

export const Primary: Story = {
  decorators: [
    withConfig
  ]
};