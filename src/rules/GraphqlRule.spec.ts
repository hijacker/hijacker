import { describe, expect, it } from 'vitest';

import { HijackerRequest } from '../types/Request';
import { GraphqlRule, GraphqlRuleType } from './GraphqlRule';

describe('GraphqlRule', () => {
  describe('isMatch', () => {
    it('should match correct operationName', () => {
      expect.assertions(2);

      const ruleType = new GraphqlRuleType();
  
      const rule = new GraphqlRule({
        operationName: 'CreateTest'
      });
  
      const reqOne = { 
        body: {
          query: 'query Test { tests { result time name } }'
        }
      } as HijackerRequest;
      const reqTwo = { 
        body: {
          query: 'query CreateTest { tests { result time name } }'
        }
      } as HijackerRequest;
  
      expect(ruleType.isMatch(reqOne, rule)).toBe(false);
      expect(ruleType.isMatch(reqTwo, rule)).toBe(true);
    });
  });
});