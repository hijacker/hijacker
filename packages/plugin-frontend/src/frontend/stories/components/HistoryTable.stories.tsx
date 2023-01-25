import type { Meta, StoryObj } from '@storybook/react';

import { HistoryTable } from '../../components/HistoryTable';

const meta: Meta<typeof HistoryTable> = {
  title: 'Components/History/HistoryTable',
  component: HistoryTable,
};

export default meta;
type Story = StoryObj<typeof HistoryTable>;

export const Primary: Story = {
  args: {
    history: [{
      requestId: '123',
      hijackerRequest: {
        timestamp: 1231232,
        requestId: '123',
        body: {},
        headers: {},
        method: 'DELETE',
        path: '/test'
      }
    }]
  },
};