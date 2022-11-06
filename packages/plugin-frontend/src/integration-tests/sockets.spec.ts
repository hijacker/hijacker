import { Hijacker } from '@hijacker/core';
import type { Config } from '@hijacker/core';
import got from 'got';
import nock from 'nock';
import io from 'socket.io-client';
import { describe, beforeAll, it, expect, beforeEach, afterEach, afterAll } from 'vitest';

import { FrontendPlugin } from '../FrontendPlugin.js';

describe('Socket Tests', () => {
  let hijackerServer: Hijacker;
  let nockServer: any;
  let socket: any;

  beforeAll(() => {
    const config: Config = {
      port: 4000,
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
        },
        {
          path: '/cars',
          skipApi: false,
          method: 'PUT',
          statusCode: 418
        }
      ],
      logger: {
        level: 'NONE'
      },
      plugins: [
        new FrontendPlugin({
          port: 4001
        })
      ]
    };

    hijackerServer = new Hijacker(config);
    nockServer = nock('http://hijacker.testing.com');
  });

  afterAll(() => {
    hijackerServer.close();
  });

  beforeEach(() => {
    socket = io('http://localhost:4001');
  });

  afterEach(() => {
    socket.close();
    nock.cleanAll();
  });

  it('should send list of rules on socket connect', () => new Promise<void>((done) => {
    socket.on('SETTINGS', (data: any) => {
      expect(data.rules.length).toBe(3);
      done();
    });
  }));

  it('should add a new rule when ADD_RULES event sent', () => new Promise<void>(async (done) => {
    expect.assertions(2);

    nockServer.get('/error').reply(400);

    try {
      await got.get('http://localhost:4000/error');
    } catch (e) {
      expect(true).toBe(true);
    }

    socket.emit('ADD_RULES', [{
      path: '/error',
      skipApi: true,
      method: 'GET',
      statusCode: 200,
      body: {
        error: 'works'
      }
    }]);

    setTimeout(async () => {
      const response = await got.get('http://localhost:4000/error');

      expect(JSON.parse(response.body)).toEqual({
        error: 'works'
      });

      done();
    }, 100);
  }));

  it('should update a new rule when UPDATE_RULES event sent', () => new Promise<void>((done) => {
    expect.assertions(2);

    let ruleList: any;

    socket.on('SETTINGS', async (data: any) => {
      ruleList = data.rules;

      const response = await got.get('http://localhost:4000/cars');

      expect(JSON.parse(response.body)).toEqual({
        test: 'testing'
      });

      ruleList[0].body = {
        new: 'body'
      };

      socket.emit('UPDATE_RULES', [ruleList[0]]);

      setTimeout(async () => {
        const response = await got.get('http://localhost:4000/cars');

        expect(JSON.parse(response.body)).toEqual({
          new: 'body'
        });

        done();
      }, 100);
    });
  }));

  it('should send updated rule list on ADD_RULES', () => new Promise<void>((done) => {
    expect.assertions(1);

    let ruleList;

    socket.on('UPDATE_RULES', (data: any) => {
      expect(data.length).toBe(ruleList.length + 1);
      done();
    });

    socket.on('SETTINGS', (data: any) => {
      ruleList = data.rules;

      socket.emit('ADD_RULES', [{
        path: '/error',
        skipApi: true,
        method: 'GET',
        statusCode: 200
      }]);
    });
  }));

  it('should send updated rule list on UPDATE_RULES', () => new Promise<void>((done) => {
    expect.assertions(1);

    let ruleList;

    socket.on('UPDATE_RULES', (data: any) => {
      expect(data[0].body).toEqual({
        updated: 'rule'
      });
      done();
    });

    socket.on('SETTINGS', (data: any) => {
      ruleList = data.rules;

      const newRule = Object.assign({}, ruleList[0], {
        body: {
          updated: 'rule'
        }
      });

      socket.emit('UPDATE_RULES', [newRule]);
    });
  }));

  it('should delete rules on DELETE_RULES', () => new Promise<void>((done) => {
    expect.assertions(2);

    const numRules = hijackerServer.context.ruleManager.rules.length;

    socket.on('UPDATE_RULES', (data: any) => {
      expect(data.length).toBe(numRules - 2);

      done();
    });

    socket.on('SETTINGS', (data: any) => {
      expect(data.rules.length).toBe(numRules);

      socket.emit('DELETE_RULES', [data.rules[0].id, data.rules[1].id]);
    });
  }));
});
