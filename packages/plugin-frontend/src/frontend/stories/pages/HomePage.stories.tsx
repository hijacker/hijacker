import type { Meta, StoryObj } from '@storybook/react';

import { withConfig } from '../../.storybook/decorators';
import { HomePage } from '../../pages/HomePage';

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