import got from 'got';
import nock, { Scope } from 'nock';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { Hijacker } from '../hijacker';
import { Config } from '../types/Config';
import { HijackerRequest, HijackerResponse } from '../types/Request';
import { Plugin } from '../utils/PluginManager';

describe('Plugin Tests', () => {
  let config: Config;
  let nockServer: Scope;

  beforeAll(() => {
    nockServer = nock('http://hijacker.testing.com');
  });

  beforeEach(() => {
    config = {
      port: 3001,
      baseRule: {
        baseUrl: 'http://hijacker.testing.com',
        type: 'TestRule'
      },
      rules: [],
      logger: {
        level: "NONE"
      }
    };
  });
  
  describe('RuleTypes', () => {
    it('should register new rule type from plugin', async () => {
      expect.assertions(1);
  
      const testPlugin: Plugin = {
        name: 'TestPlugin',
        ruleTypes: [
          {
            type: 'TestRule',
            isMatch: () => true,
            handler: async () => ({
              body: {
                example: 'hijacker'
              },
              headers: {},
              statusCode: 200
            })
          }
        ]
      };
  
      const hijacker = new Hijacker({
        ...config,
        plugins: [testPlugin]
      });
  
      const data = await got.get('http://localhost:3001/cars').json();
    
      expect(data).toEqual({
        example: 'hijacker'
      });
  
      hijacker.close(); 
    });
  });
  
  describe('Hooks', () => {
    it('should allow modifying config in HIJACKER_START', async () => {
      expect.assertions(2);
  
      const testPlugin: Plugin = {
        name: 'TestPlugin',
        handlers: {
          'HIJACKER_START': (config: Config) => {
            expect(config.port).toEqual(3001);
            
            return {
              ...config,
              rules: [{
                path: '/cars',
                skipApi: true,
                method: 'GET',
                body: {
                  test: 'testing'
                },
                type: 'rest'
              }]
            };
          }
        }
      };
  
      const hijacker = new Hijacker({
        ...config,
        plugins: [testPlugin]
      });

      const data = await got.get('http://localhost:3001/cars').json();
    
      expect(data).toEqual({
        test: 'testing'
      });
  
      hijacker.close();
    });

    it('should allow modifying request recieved by hijacker in HIJACKER_REQUEST', async () => {
      expect.assertions(2);
  
      const testPlugin: Plugin = {
        name: 'TestPlugin',
        handlers: {
          // Redirect path to /posts
          'HIJACKER_REQUEST': (request: HijackerRequest) => {
            expect(request.path).toEqual('/cars');
            
            return {
              ...request,
              path: '/posts'
            };
          }
        }
      };

      config.baseRule.type = 'rest';
  
      const hijacker = new Hijacker({
        ...config,
        plugins: [testPlugin]
      });

      nockServer.get('/posts')
        .reply(200, {
          path: 'posts'
        });

      const data = await got.get('http://localhost:3001/cars').json();
    
      expect(data).toEqual({
        path: 'posts'
      });
  
      hijacker.close();
    });

    it('should allow modifying response sent by hijacker in HIJACKER_RESPONSE', async () => {
      expect.assertions(2);
  
      const testPlugin: Plugin = {
        name: 'TestPlugin',
        handlers: {
          // Edit response
          'HIJACKER_RESPONSE': (response: HijackerResponse) => {
            expect(response.body).toEqual({
              path: 'posts'
            });

            return {
              ...response,
              body: {
                changed: 'body'
              }
            };
          }
        }
      };

      config.baseRule.type = 'rest';
  
      const hijacker = new Hijacker({
        ...config,
        plugins: [testPlugin]
      });

      nockServer.get('/posts')
        .reply(200, {
          path: 'posts'
        });

      const data = await got.get('http://localhost:3001/posts').json();
    
      expect(data).toEqual({
        changed: 'body'
      });
  
      hijacker.close();
    });
  });
});