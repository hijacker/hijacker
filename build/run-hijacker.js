import { Hijacker } from '../dist/hijacker.js';

const hijacker = new Hijacker({
  port: 3000,
  baseRule: {
    baseUrl: 'https://api.spacex.land',
    type: 'graphql'
  },
  rules: [
    {
      operationName: 'Test',
      path: '/cars',
      skipApi: true,
      body: {
        Hello: 'World'
      }
    }
  ],
  plugins: []
});

process.on('beforeExit', () => {
  hijacker.close();
});