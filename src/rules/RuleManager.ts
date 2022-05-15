import { Newable } from '../../types/index.js';
import { Request, HijackerRequest, HijackerResponse } from '../../types/Request.js';
import { IRule, Rule } from './Rule.js';
import { RestRule } from './RestRule.js';

export class RuleType {
  type = '';

  isMatch(request: HijackerRequest, rule: Rule): boolean {
    throw new Error('Not implemented');
  }

  async handler(request: Request): Promise<HijackerResponse> {
    throw new Error('Not implemented');
  }
}

interface RuleManagerOptions {
  ruleTypes: Newable<RuleType>[];
  rules: Partial<IRule>[];
  baseRule: Partial<IRule>;
}

export class RuleManager {
  ruleTypes: Record<string, RuleType>;
  rules: Rule[];
  baseRule: Partial<IRule>;

  constructor({ ruleTypes, rules, baseRule}: RuleManagerOptions) {
    this.baseRule = baseRule;
    this.rules = [];
    this.ruleTypes = {
      rest: new RestRule(),
      ...ruleTypes.reduce((acc, cur) => {
        const tempType = new cur();

        return {
          ...acc,
          [tempType.type]: tempType
        };
      }, {})
    };

    rules.map(r => this.addRule(r));
  }

  addRule(rule: Partial<IRule>) {
    this.rules.push(new Rule({
      ...this.baseRule,
      ...rule
    }));
  }

  match(request: HijackerRequest) {
    return this.rules.find(r => {
      const ruleType = r.type ?? 'rest';

      return !r.disabled && this.ruleTypes[ruleType].isMatch(request, r);
    });
  }

  async handler(requestType: string, request: Request): Promise<HijackerResponse> {
    // TODO: Check if type has been registered
    return this.ruleTypes[requestType].handler(request);
  }
}
