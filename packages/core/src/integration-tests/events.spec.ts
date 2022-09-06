import { describe, beforeAll, it, expect } from 'vitest';

import { Hijacker } from '../hijacker.js';
import type { Config } from '../types/index.js';

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
          body: {
            test: 'testing'
          }
        },
        {
          path: '/posts',
          skipApi: true,
          method: 'GET',
          body: {
            posts: 'get'
          }
        }
      ],
      logger: {
        level: 'NONE'
      }
    };
  });

  it('should emit an event on server start up', () => new Promise<void>((done) => {
    expect.assertions(1);
    
    const hijackerServer = new Hijacker(config);

    hijackerServer.on('started', (port: number) => {
      expect(port).toBe(config.port);
      hijackerServer.close();
      done();
    });
  }));
});
