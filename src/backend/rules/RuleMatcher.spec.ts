import express from 'express';
import { Rule } from '../../types/Rule';
import { RuleMatcher, RuleType } from './RuleMatcher';

class NewRule implements RuleType {
  type = 'NewRule';

  isMatch(request: express.Request, rule: Rule): boolean {
    return rule.name === 'NEW RULE MATCH';
  }

  handler() {
    return false;
  }
}

describe('RuleMatcher', () => {
  it('should have default rest matcher if none provided', () => {
    const ruleMatcher = new RuleMatcher();

    expect(Object.keys(ruleMatcher.ruleTypes)).toEqual(['rest']);
  });

  it('should support adding custom rule type', () => {
    const ruleMatcher = new RuleMatcher([NewRule]);

    expect(Object.keys(ruleMatcher.ruleTypes)).toEqual(['rest', 'NewRule']);
  });

  it('should match with the correct rule type', () => {
    const ruleMatcher = new RuleMatcher([NewRule]);
    const rules: Rule[] = [
      {
        path: '/cars',
        skipApi: true,
        body: {
          Hello: 'World'
        }
      } as any as Rule,
      {
        type: 'NewRule',
        name: 'NEW RULE MATCH',
        path: '/cars',
        skipApi: true,
        body: {
          Hello: 'World'
        }
      } as any as Rule,
    ];

    // NewRule matches any rule that has name 'NEW RULE MATCH'
    const req = { originalUrl: '/testing', method: 'POST' } as express.Request;

    const match = ruleMatcher.match(req, rules);

    expect(match).toEqual(rules[1]);
  });
});