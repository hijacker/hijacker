import { HijackerResponse, HijackerRequest } from '../../types/Request';
import { Rule } from './Rule';
import { RuleManager, RuleType } from './RuleManager';

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
    const ruleManager = new RuleManager({
      ruleTypes: [],
      rules: [],
      baseRule: {}
    });

    expect(Object.keys(ruleManager.ruleTypes)).toEqual(['rest']);
  });

  it('should support adding custom rule type', () => {
    const ruleManager = new RuleManager({
      ruleTypes: [NewRule],
      rules: [],
      baseRule: {}
    });

    expect(Object.keys(ruleManager.ruleTypes)).toEqual(['rest', 'NewRule']);
  });

  it('should match with the correct rule type', () => {
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