import { describe, it, expect, vi } from 'vitest';

import { HijackerContext } from '../types/index.js';
import { HijackerResponse, HijackerRequest, Request } from '../types/Request.js';
import { Logger } from '../utils/Logger.js';
import { RestRuleType } from './RestRule.js';
import { Rule } from './Rule.js';
import { RuleManager } from './RuleManager.js';

class NewRuleType extends RestRuleType {
  type = 'NewRule';
  
  createRule(rule: Partial<Rule>) {
    return super.createRule(rule);
  }

  isMatch(request: HijackerRequest, rule: Rule): boolean {
    return rule.name === 'NEW RULE MATCH';
  }

  async handler(): Promise<HijackerResponse> {
    throw new Error('');
  }
}

describe('RuleManager', () => {
  const logger: Logger = {
    level: 'NONE',
    log: vi.fn()
  };

  it('should have default rest and graphql matchers if none provided', () => {
    expect.assertions(1);

    const ruleManager = new RuleManager({ logger });
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

    const ruleManager = new RuleManager({ logger });
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
    
    const ruleManager = new RuleManager({ logger });

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
    
    expect(match.id).toEqual(ruleManager.rules[1].id);
  });

  it('should delete rule from rule list', () => {
    expect.assertions(3);

    const ruleManager = new RuleManager({ logger });
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

    const ruleManager = new RuleManager({ logger });
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

    const ruleManager = new RuleManager({ logger });
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

  it('should not allow adding rule for non-existant rule-type', () => {
    expect.assertions(1);

    const ruleManager = new RuleManager({ logger });
    ruleManager.init({
      rules: [],
      baseRule: {
        baseUrl: ''
      }
    });

    expect(() => {
      ruleManager.addRules([{
        path: '/cars',
        name: 'Rule 1',
        skipApi: true,
        body: {
          Hello: 'World'
        },
        type: 'fakeRule'
      }]);
    }).toThrow('Cannot register rule for non-existant rule type `fakeRule`');
  });

  it('should not allow updating rule to a non-existant rule-type', () => {
    expect.assertions(1);

    const ruleManager = new RuleManager({ logger });
    ruleManager.init({
      rules: [],
      baseRule: {
        baseUrl: ''
      }
    });

    expect(() => {
      ruleManager.updateRule({
        type: 'fakeRule'
      });
    }).toThrow();
  });

  it('should throw error when trying to handle unregistered rule type', () => {
    expect.assertions(1);

    const ruleManager = new RuleManager({ logger });
    ruleManager.init({
      rules: [],
      baseRule: {
        baseUrl: ''
      }
    });

    expect(
      ruleManager.handler(
        'fakeRule',
        {} as Request,
        {} as HijackerContext
      )
    ).rejects.toThrow();
  });
});