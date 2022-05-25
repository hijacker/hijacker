import { describe, it, expect } from 'vitest';

import { HijackerResponse, HijackerRequest } from '../types/Request.js';
import { Rule } from './Rule.js';
import { RuleManager, RuleType } from './RuleManager.js';

class NewRule implements RuleType {
  type = 'NewRule';

  isMatch(request: HijackerRequest, rule: Rule): boolean {
    return rule.name === 'NEW RULE MATCH';
  }

  async handler(): Promise<HijackerResponse> {
    throw new Error('');
  }
}

describe('RuleManager', () => {
  it('should have default rest matcher if none provided', () => {
    expect.assertions(1);

    const ruleManager = new RuleManager({
      ruleTypes: [],
      rules: [],
      baseRule: {}
    });

    expect(Object.keys(ruleManager.ruleTypes)).toEqual(['rest']);
  });

  it('should support adding custom rule type', () => {
    expect.assertions(1);

    const ruleManager = new RuleManager({
      ruleTypes: [NewRule],
      rules: [],
      baseRule: {}
    });

    expect(Object.keys(ruleManager.ruleTypes)).toEqual(['rest', 'NewRule']);
  });

  it('should match with the correct rule type', () => {
    expect.assertions(1);
    
    const ruleManager = new RuleManager({
      ruleTypes: [NewRule],
      rules: [
        {
          path: '/cars',
          skipApi: true,
          body: {
            Hello: 'World'
          }
        },
        {
          type: 'NewRule',
          name: 'NEW RULE MATCH',
          path: '/cars',
          skipApi: true,
          body: {
            Hello: 'World'
          }
        },
      ],
      baseRule: {}
    });

    // NewRule matches any rule that has name 'NEW RULE MATCH'
    const req: HijackerRequest = {
      path: '/testing',
      method: 'POST',
      headers: {},
      body: {}
    };

    const match = ruleManager.match(req);

    expect(match).toEqual(ruleManager.rules[1]);
  });
});