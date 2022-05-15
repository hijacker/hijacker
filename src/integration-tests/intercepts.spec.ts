/* eslint-disable @typescript-eslint/no-empty-function */
import { describe, beforeAll, it, expect, beforeEach, afterEach, afterAll } from 'vitest';

import axios from 'axios';
import io from 'socket.io-client';
import { Config } from '../../types/Config';

import { Hijacker } from '../hijacker';

describe('Intercept Tests', () => {
  const { CancelToken } = axios;
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

  it('should send a socket event on interceptRequest and continue on emit', () => new Promise((done) => {
    const source = CancelToken.source();

    socket.on('INTERCEPT', () => {
      source.cancel();
      done();
    });

    axios.get('http://localhost:2000/cars', { cancelToken: source.token })
      .then(() => {
        expect(true).toBe(false);
      })
      .catch(() => {});
  }));

  it('should send a socket event on interceptResponse and continue on emit', () => new Promise((done) => {
    const source = CancelToken.source();

    socket.on('INTERCEPT', () => {
      source.cancel();
      done();
    });

    axios.get('http://localhost:2000/posts', { cancelToken: source.token })
      .then(() => {
        expect(true).toBe(false);
      })
      .catch(() => {});
  }));

  it('should allow modifying data in interceptRequest', () => new Promise((done) => {
    socket.on('INTERCEPT', (data: any) => {
      const newObj = data;
      expect(typeof newObj).toBe('object');

      newObj.rule.body = {
        body: 'intercepted'
      };

      socket.emit(newObj.intercept.id, newObj);
    });

    axios.get('http://localhost:2000/cars')
      .then((response) => {
        expect(response.data).toEqual({
          body: 'intercepted'
        });
        done();
      });
  }));

  it('should allow modifying data in interceptResponse', () => new Promise((done) => {
    socket.on('INTERCEPT', (data: any) => {
      const newObj = data;
      expect(typeof newObj).toBe('object');

      newObj.response.body = {
        body: 'intercepted'
      };

      socket.emit(newObj.intercept.id, newObj);
    });

    axios.get('http://localhost:2000/posts')
      .then((response) => {
        expect(response.data).toEqual({
          body: 'intercepted'
        });
        done();
      });
  }));

  it.todo('should only listen for one reponse from client per intercept');
});
