import type { Meta, StoryObj } from '@storybook/react';

import "../../.storybook/monaco-shim";

import { HistoryItem } from '../../components/HistoryItem';


const meta: Meta<typeof HistoryItem> = {
  title: 'Components/History/HistoryItem',
  component: HistoryItem,
};

export default meta;
type Story = StoryObj<typeof HistoryItem>;

export const Primary: Story = {
  args: {
    item: {
      requestId: "123",
      hijackerRequest: {
        requestId: "123",
        body: {
          hello: 'world'
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Content-Security-Policy': 'default-src \'none\'',
          'X-Content-Type-Options': 'nosniff',
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': '153',
          'Vary': 'Accept-Encoding',
          'Date': 'Wed, 28 Dec 2022 23:57:30 GMT',
          'Connection': 'keep-alive',
          'Keep-Alive': 'timeout=5'
        },
        method: 'DELETE',
        path: '/test'
      },
      hijackerResponse: {
        requestId: "123",
        body: {
          foo: 'bar'
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Content-Security-Policy': 'default-src \'none\'',
          'X-Content-Type-Options': 'nosniff',
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': '153',
          'Vary': 'Accept-Encoding',
          'Date': 'Wed, 28 Dec 2022 23:57:30 GMT',
          'Connection': 'keep-alive',
          'Keep-Alive': 'timeout=5'
        },
        statusCode: 400
      }
    }
  },
};

export const NoResponse: Story = {
  args: {
    item: {
      requestId: "123",
      hijackerRequest: {
        requestId: "123",
        body: {},
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Content-Security-Policy': 'default-src \'none\'',
          'X-Content-Type-Options': 'nosniff',
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': '153',
          'Vary': 'Accept-Encoding',
          'Date': 'Wed, 28 Dec 2022 23:57:30 GMT',
          'Connection': 'keep-alive',
          'Keep-Alive': 'timeout=5'
        },
        method: 'DELETE',
        path: '/test'
      }
    }
  },
};

export const NoHeaders: Story = {
  args: {
    item: {
      requestId: "123",
      hijackerRequest: {
        requestId: "123",
        body: {},
        headers: {},
        method: 'DELETE',
        path: '/test'
      }
    }
  },
};

