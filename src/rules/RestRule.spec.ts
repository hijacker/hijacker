import { describe, it, expect } from 'vitest';

import { HijackerRequest } from '../types/Request.js';
import { RestRule } from './RestRule.js';
import { Rule } from './Rule.js';

describe('RestRule', () => {
  describe('isMatch', () => {
    it('should match correct path', () => {
      expect.assertions(2);

      const ruleType = new RestRule();
  
      const rule = new Rule({
        path: '/test-route',
        method: 'POST'
      });
  
      const reqOne = { path: '/test-route/1', method: 'POST' } as HijackerRequest;
      const reqTwo = { path: '/test-route', method: 'POST' } as HijackerRequest;
  
      expect(ruleType.isMatch(reqOne, rule)).toBe(false);
      expect(ruleType.isMatch(reqTwo, rule)).toBe(true);
    });
  
    it('should match correct method', () => {
      expect.assertions(2);

      const ruleType = new RestRule();
  
      const rule = new Rule({
        path: '/test-route',
        method: 'POST'
      });
  
      const reqOne = { path: '/test-route', method: 'POST' } as HijackerRequest;
      const reqTwo = { path: '/test-route', method: 'GET' } as HijackerRequest;
  
      expect(ruleType.isMatch(reqOne, rule)).toBe(true);
      expect(ruleType.isMatch(reqTwo, rule)).toBe(false);
    });
  
    it('should match ALL method', () => {
      expect.assertions(2);

      const ruleType = new RestRule();
  
      const rule = new Rule({
        path: '/test-route',
        method: 'ALL'
      });
  
      const reqOne = { path: '/test-route', method: 'POST' } as HijackerRequest;
      const reqTwo = { path: '/test-route', method: 'GET' } as HijackerRequest;
  
      expect(ruleType.isMatch(reqOne, rule)).toBe(true);
      expect(ruleType.isMatch(reqTwo, rule)).toBe(true);
    });
  
    it('should match parameters in path', () => {
      expect.assertions(2);
      
      const ruleType = new RestRule();
  
      const rule = new Rule({
        path: '/test-route/:id',
        method: 'POST'
      });
  
      const reqOne = { path: '/test-route/12', method: 'POST' } as HijackerRequest;
      const reqTwo = { path: '/test-route', method: 'POST' } as HijackerRequest;
  
      expect(ruleType.isMatch(reqOne, rule)).toBe(true);
      expect(ruleType.isMatch(reqTwo, rule)).toBe(false);
    });
  });
  
  describe('handler', () => {
    it('should handle a rest request correctly', () => {
      const ruleType = new RestRule();
  
      // expect(ruleType.handler).toThrow();
    });
  });
});