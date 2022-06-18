import { Hijacker } from '../dist/hijacker.js';

const hijacker = new Hijacker({
  port: 3000,
  baseRule: {
    baseUrl: 'https://jsonplaceholder.typicode.com'
  },
  rules: [
    {
      path: '/cars',
      skipApi: true,
      body: {
        Hello: 'World'
      }
    }
  ]
});

process.on('beforeExit', () => {
  hijacker.close();
});