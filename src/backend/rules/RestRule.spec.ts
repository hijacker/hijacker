import { HijackerRequest } from '../../types/Request';
import { Rule } from './Rule';
import { RestRule } from './RestRule';

describe('RestRule', () => {
  describe('isMatch', () => {
    it('should match correct path', () => {
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