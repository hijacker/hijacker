/* eslint-disable @typescript-eslint/no-empty-function */
import got, { CancelableRequest, Response } from 'got';
import io from 'socket.io-client';
import { describe, beforeAll, it, expect, beforeEach, afterEach, afterAll } from 'vitest';

import { Hijacker } from '../hijacker.js';
import type { Config } from '../types/index.js';

describe.skip('Intercept Tests', () => {
  let hijackerServer: Hijacker;
  let socket: any;

  beforeAll(() => {
    const config: Config = {
      port: 2000,
      baseRule: {
        baseUrl: 'http://hijacker.testing.com'
      },
      rules: [
        {
          path: '/cars',
          skipApi: true,
          method: 'GET',
          // interceptRequest: true,
          body: {
            test: 'testing'
          }
        },
        {
          path: '/posts',
          skipApi: true,
          method: 'GET',
          // interceptResponse: true,
          body: {
            posts: 'get'
          }
        }
      ],
      logger: {
        level: 'NONE'
      }
    };

    hijackerServer = new Hijacker(config);
  });

  beforeEach(() => new Promise((done) => {
    socket = io('http://localhost:2000');

    socket.on('connect', () => {
      done();
    });
  }));

  afterEach(() => {
    socket.close();
  });

  afterAll(() => {
    socket.close();
    hijackerServer.close();
  });

  it('should send a socket event on interceptRequest and continue on emit', () => new Promise<void>((done) => {
    expect.assertions(1);

    let request: CancelableRequest<Response>;

    socket.on('INTERCEPT', () => {
      request.cancel();
    });

    request = got.get('http://localhost:2000/cars');

    request.then(() => {
      expect(true).toBe(false);
    }).catch(() => {
      expect(true).toBe(true);
      done();
    });
  }));

  it('should send a socket event on interceptResponse and continue on emit', () => new Promise<void>((done) => {
    expect.assertions(1);
    
    let request: CancelableRequest<Response>;

    socket.on('INTERCEPT', () => {
      request.cancel();
    });

    request = got.get('http://localhost:2000/posts');

    request.then(() => {
      expect(true).toBe(false);
    }).catch(() => {
      expect(true).toBe(true);
      done();
    });
  }));

  it('should allow modifying data in interceptRequest', () => new Promise<void>((done) => {
    expect.assertions(2);

    socket.on('INTERCEPT', (data: any) => {
      const newObj = data;
      expect(typeof newObj).toBe('object');

      newObj.rule.body = {
        body: 'intercepted'
      };

      socket.emit(newObj.intercept.id, newObj);
    });

    got.get('http://localhost:2000/cars')
      .then((response) => {
        expect(JSON.parse(response.body)).toEqual({
          body: 'intercepted'
        });
        done();
      });
  }));

  it('should allow modifying data in interceptResponse', () => new Promise<void>((done) => {
    expect.assertions(2);
    
    socket.on('INTERCEPT', (data: any) => {
      const newObj = data;
      expect(typeof newObj).toBe('object');

      newObj.response.body = {
        body: 'intercepted'
      };

      socket.emit(newObj.intercept.id, newObj);
    });

    got.get('http://localhost:2000/posts')
      .then((response) => {
        expect(JSON.parse(response.body)).toEqual({
          body: 'intercepted'
        });
        done();
      });
  }));

  it.todo('should only listen for one reponse from client per intercept');
});
