import { defineConfig } from '@hijacker/core';

export default defineConfig({
  port: 3000,
  baseRule: {
    baseUrl: 'https://jsonplaceholder.typicode.com/'
  },
  rules: [{
    name: 'cars',
    path: '/cars',
    body: {
      hello: 'world'
    }
  }]
})