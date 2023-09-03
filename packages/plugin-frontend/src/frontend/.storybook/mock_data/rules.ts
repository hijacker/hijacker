import { Rule } from '@hijacker/core';

export const mockRules: Rule<any>[] = [
  {
    id: '123',
    baseUrl: 'http://localhost:1233',
    name: 'View Cars',
    method: 'GET',
    path: '/cars',
    body: {
      hello: 'world'
    }
  },
  {
    id: '124',
    baseUrl: 'http://localhost:1233',
    name: 'Set Cars',
    method: 'POST',
    path: '/cars',
    body: {
      hello: 'world'
    }
  }
]