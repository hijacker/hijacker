import type { HijackerRequest } from '@hijacker/core';
import { describe, expect, it } from 'vitest';

import { GraphQLRuleType } from './GraphQLRule.js';

describe('GraphqlRule', () => {
  describe('isMatch', () => {
    it('should match correct operationName', () => {
      expect.assertions(2);

      const ruleType = new GraphQLRuleType();
  
      const rule = ruleType.createRule({
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

    it('should not match invalid graphql query', () => {
      expect.assertions(1);

      const ruleType = new GraphQLRuleType();
  
      const rule = ruleType.createRule({
        operationName: 'CreateTest'
      });

      const req = { 
        body: {
          query: ' query CreateTest {'
        }
      } as HijackerRequest;

      expect(ruleType.isMatch(req, rule)).toBe(false);
    });
  });
});