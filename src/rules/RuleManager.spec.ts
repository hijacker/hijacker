import { describe, it, expect } from 'vitest';

import { HijackerResponse, HijackerRequest } from '../types/Request.js';
import { RestRule } from './RestRule.js';
import { Rule } from './Rule.js';
import { RuleManager, RuleType } from './RuleManager.js';

class NewRuleType implements RuleType {
  type = 'NewRule';
  ruleClass = RestRule;

  isMatch(request: HijackerRequest, rule: Rule): boolean {
    return rule.name === 'NEW RULE MATCH';
  }

  async handler(): Promise<HijackerResponse> {
    throw new Error('');
  }
}

describe('RuleManager', () => {
  it('should have default rest and graphql matchers if none provided', () => {
    expect.assertions(1);

    const ruleManager = new RuleManager();
    ruleManager.init({
      rules: [],
      baseRule: {
        baseUrl: ''
      }
    });

    expect(Object.keys(ruleManager.ruleTypes)).toEqual(['rest', 'graphql']);
  });

  it('should support adding custom rule type', () => {
    expect.assertions(1);

    const ruleManager = new RuleManager();
    ruleManager.init({
      rules: [],
      baseRule: {
        baseUrl: ''
      }
    });
    ruleManager.addRuleTypes([new NewRuleType()]);

    expect(Object.keys(ruleManager.ruleTypes)).toEqual(['rest', 'graphql', 'NewRule']);
  });

  it('should match with the correct rule type', () => {
    expect.assertions(1);
    
    const ruleManager = new RuleManager();

    ruleManager.addRuleTypes([new NewRuleType()]);
    
    ruleManager.init({
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
        }
      ],
      baseRule: {
        baseUrl: ''
      }
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

  it('should delete rule from rule list', () => {
    expect.assertions(3);

    const ruleManager = new RuleManager();
    ruleManager.init({
      rules: [
        {
          path: '/cars',
          name: 'Rule 1',
          skipApi: true,
          body: {
            Hello: 'World'
          }
        },
        {
          path: '/posts',
          name: 'Rule 2',
          skipApi: true,
          body: {
            Hello: 'World'
          }
        },
      ],
      baseRule: {
        baseUrl: ''
      }
    });

    expect(ruleManager.rules.length).toBe(2);

    ruleManager.deleteRule(ruleManager.rules[0].id);

    expect(ruleManager.rules.length).toBe(1);
    expect(ruleManager.rules[0].name).toBe('Rule 2');
  });

  it('should update rule in rule list', () => {
    expect.assertions(2);

    const ruleManager = new RuleManager();
    ruleManager.init({
      rules: [
        {
          path: '/cars',
          name: 'Rule 1',
          skipApi: true,
          body: {
            Hello: 'World'
          }
        },
        {
          path: '/posts',
          name: 'Rule 2',
          skipApi: true,
          body: {
            Hello: 'World'
          }
        },
      ],
      baseRule: {
        baseUrl: ''
      }
    });

    expect(ruleManager.rules[0].name).toBe('Rule 1');

    ruleManager.updateRule({
      ...ruleManager.rules[0],
      name: 'New Name'
    });

    expect(ruleManager.rules[0].name).toBe('New Name');
  });

  it('should add rule to rule list', () => {
    expect.assertions(3);

    const ruleManager = new RuleManager();
    ruleManager.init({
      rules: [],
      baseRule: {
        baseUrl: ''
      }
    });

    expect(ruleManager.rules.length).toBe(0);

    ruleManager.addRules([{
      path: '/cars',
      name: 'Rule 1',
      skipApi: true,
      body: {
        Hello: 'World'
      }
    }]);

    expect(ruleManager.rules[0].name).toBe('Rule 1');
    expect(ruleManager.rules.length).toBe(1);
  });
});