import got, { RequestError } from 'got';
import nock from 'nock';
import { describe, beforeAll, it, expect, afterEach, afterAll } from 'vitest';

import { Hijacker } from '../hijacker.js';
import { Config } from '../types/Config.js';

describe('Request Tests', () => {
  let hijackerServer: Hijacker;
  let nockServer: any;

  beforeAll(() => {
    const config: Config = {
      port: 3000,
      baseRule: {
        baseUrl: 'http://hijacker.testing.com'
      },
      rules: [
        {
          path: '/cars',
          skipApi: false,
          method: 'POST',
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

  afterEach(() => {
    // Cleear all intercepts incase a test fails
    nock.cleanAll();
  });

  it('should return 204 for favicon', async () => {
    expect.assertions(1);
    
    const { statusCode } = await got.get('http://localhost:3000/favicon.ico');
    
    expect(statusCode).toBe(204);
  });

  it('should return api result if no matching rule', async () => {
    expect.assertions(1);

    nockServer.get('/cars')
      .reply(200, {
        id: 1,
        make: 'Ford',
        model: 'Mustang'
      });

    const data = await got.get('http://localhost:3000/cars').json();

    expect(data).toEqual({
      id: 1,
      make: 'Ford',
      model: 'Mustang'
    });
  });

  it('should return rule body if matching rule', async () => {
    expect.assertions(1);

    nockServer.post('/cars')
      .reply(200, {
        id: 1,
        make: 'Ford',
        model: 'Mustang'
      });

    const data = await got.post('http://localhost:3000/cars').json();

    expect(data).toEqual({
      test: 'testing'
    });
  });

  it('should make sure body is sent to server correctly', async () => {
    expect.assertions(1);

    // Only reply if body matches
    nockServer.post('/cars', { color: 'red' })
      .reply(200, {
        id: 1,
        make: 'Ford',
        model: 'Mustang'
      });

    const data = await got.post('http://localhost:3000/cars', {
      json: { color: 'red' }
    }).json();

    expect(data).toEqual({
      test: 'testing'
    });
  });

  it('should not hit api if skipApi enabled', async () => {
    expect.assertions(2);

    const nockReq = nockServer.get('/posts')
      .reply(200, {
        id: 1,
        make: 'Ford',
        model: 'Mustang'
      });

    const data = await got.get('http://localhost:3000/posts').json();

    expect(data).toEqual({
      posts: 'get'
    });

    // nock intercept should be active b/c api skiped
    expect(nockReq.isDone()).toBe(false);
  });

  it('should set the status code if specified in rule', async () => {
    expect.assertions(1);
    
    nockServer.put('/cars')
      .reply(200, {
        id: 1,
        make: 'Ford',
        model: 'Mustang'
      });

    // Might need to be caught?
    try {
      await got.put('http://localhost:3000/cars');
    } catch (error) {
      if (error instanceof RequestError) {
        expect(error.response?.statusCode).toBe(418);
      }
    }
  });

  it.todo('should return server status code correctly');

  it('should forward error from server correctly', async () => {
    expect.assertions(2);

    nockServer.put('/error')
      .reply(404, {
        error: 'Not Found'
      });
    
    try {
      const response = await got.put('http://localhost:3000/error').json();
    } catch (error) {
      if (error instanceof RequestError) {
        expect(error.response?.statusCode).toBe(404);
        expect(JSON.parse(error.response?.body as string ?? '')).toEqual({
          error: 'Not Found'
        });
      }
    }
  });

  it.todo('should remove all hopbyhop headers before returning response to client');
  it.todo('should forward rest of headers from api');
});
