import { describe, beforeAll, it, expect, beforeEach, afterEach, afterAll } from 'vitest';

import axios from 'axios';
import io from 'socket.io-client';
import nock from 'nock';

import { Hijacker } from '../hijacker';
import { Config } from '../../types/Config';

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
      ]
    };

    hijackerServer = new Hijacker(config);
    nockServer = nock('http://hijacker.testing.com');
  });

  afterAll(() => {
    hijackerServer.close();
  });

  beforeEach(() => {
    socket = io('http://localhost:4000');
  });

  afterEach(() => {
    socket.close();
    nock.cleanAll();
  });

  it('should send list of rules on socket connect', () => new Promise((done) => {
    socket.on('SETTINGS', (data: any) => {
      expect(data.rules.length).toBe(3);
      done();
    });
  }));

  it('should add a new rule when ADD_RULE event sent', () => new Promise((done) => {
    nockServer.get('/error').reply(400);

    setTimeout(() => {
      axios.get('http://localhost:4000/error')
        .catch(() => {
          expect(true).toBe(true);
        })
        .then(() => {
          socket.emit('ADD_RULE', {
            path: '/error',
            skipApi: true,
            method: 'GET',
            statusCode: 200,
            body: {
              error: 'works'
            }
          });

          return axios.get('http://localhost:4000/error');
        })
        .then((response) => {
          expect(response.data).toEqual({
            error: 'works'
          });

          done();
        });
    }, 100);
    
  }));

  it('should update a new rule when UPDATE_RULE event sent', () => new Promise((done) => {
    let ruleList: any;

    socket.on('SETTINGS', (data: any) => {
      ruleList = data.rules;

      axios.get('http://localhost:4000/cars')
        .then((response) => {
          expect(response.data).toEqual({
            test: 'testing'
          });

          ruleList[0].body = {
            new: 'body'
          };

          socket.emit('UPDATE_RULE', ruleList[0]);

          return axios.get('http://localhost:4000/cars');
        })
        .then((response) => {
          expect(response.data).toEqual({
            new: 'body'
          });

          done();
        });
    });
  }));

  it('should send updated rule list on ADD_RULE', () => new Promise((done) => {
    let ruleList;

    socket.on('UPDATE_RULES', (data: any) => {
      expect(data.length).toBe(ruleList.length + 1);
      done();
    });

    socket.on('SETTINGS', (data: any) => {
      ruleList = data.rules;

      socket.emit('ADD_RULE', {
        path: '/error',
        skipApi: true,
        method: 'GET',
        statusCode: 200
      });
    });
  }));

  it('should send updated rule list on UPDATE_RULE', () => new Promise((done) => {
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

      socket.emit('UPDATE_RULE', newRule);
    });
  }));
});
