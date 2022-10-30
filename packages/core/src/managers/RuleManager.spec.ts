import { describe, it, expect, vi } from 'vitest';

import { HijackerContext, HijackerResponse, HijackerRequest, Request } from '../types/index.js';
import type { EventManager } from './index.js';
import { Logger } from '../utils/index.js';
import { RestRuleType } from '../rules/index.js';
import { RuleManager } from './RuleManager.js';
import type { Rule } from '../rules/index.js';

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

  const eventManager: EventManager = {
    emit: vi.fn(),
  } as any;

  it('should have default rest matcher if none provided', () => {
    expect.assertions(1);

    const ruleManager = new RuleManager({ logger, eventManager });
    ruleManager.init({
      rules: [],
      baseRule: {
        baseUrl: ''
      }
    });

    expect(Object.keys(ruleManager.ruleTypes)).toEqual(['rest']);
  });

  it('should support adding custom rule type', () => {
    expect.assertions(1);

    const ruleManager = new RuleManager({ logger, eventManager });
    ruleManager.init({
      rules: [],
      baseRule: {
        baseUrl: ''
      }
    });
    ruleManager.addRuleTypes([new NewRuleType()]);

    expect(Object.keys(ruleManager.ruleTypes)).toEqual(['rest', 'NewRule']);
  });

  it('should match with the correct rule type', () => {
    expect.assertions(1);
    
    const ruleManager = new RuleManager({ logger, eventManager });

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

    const ruleManager = new RuleManager({ logger, eventManager });
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

    const ruleManager = new RuleManager({ logger, eventManager });
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

    const ruleManager = new RuleManager({ logger, eventManager });
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

    const ruleManager = new RuleManager({ logger, eventManager });
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

    const ruleManager = new RuleManager({ logger, eventManager });
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

    const ruleManager = new RuleManager({ logger, eventManager });
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