import { describe, beforeAll, it, expect } from 'vitest';

import { Config } from '../types/Config.js';
import { Hijacker } from '../hijacker.js';

describe('Event Tests', () => {
  let config: Config;

  beforeAll(() => {
    config = {
      port: 5001,
      baseRule: {
        baseUrl: 'http://hijacker.testing.com'
      },
      rules: [
        {
          path: '/cars',
          skipApi: true,
          method: 'GET',
          interceptRequest: true,
          body: {
            test: 'testing'
          }
        },
        {
          path: '/posts',
          skipApi: true,
          method: 'GET',
          interceptResponse: true,
          body: {
            posts: 'get'
          }
        }
      ]
    };
  });

  it('should emit an event on server start up', () => new Promise((done) => {
    expect.assertions(1);
    
    const hijackerServer = new Hijacker(config);

    hijackerServer.on('started', (port: number) => {
      expect(port).toBe(config.port);
      hijackerServer.close();
      done();
    });
  }));
});
