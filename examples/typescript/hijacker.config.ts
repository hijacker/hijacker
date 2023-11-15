import { defineConfig } from '@hijacker/core';
import { RandomStatusPlugin } from './plugins/RandomStatus';

export default defineConfig({
  port: 3000,
  baseRule: {
    baseUrl: 'https://jsonplaceholder.typicode.com/'
  },
  rules: [],
  plugins: [new RandomStatusPlugin()]
});