import { Newable } from '../types/index.js';
import { Request, HijackerRequest, HijackerResponse } from '../types/Request.js';
import { RestRule } from './RestRule.js';
import { BaseRule, IRule, Rule } from './Rule.js';

export class RuleType {
  type = '';

  isMatch(request: HijackerRequest, rule: Rule): boolean {
    throw new Error('Not implemented');
  }

  async handler(request: Request, baseRule: BaseRule): Promise<HijackerResponse> {
    throw new Error('Not implemented');
  }
}

interface RuleManagerOptions {
  ruleTypes: Newable<RuleType>[];
  rules: Partial<IRule>[];
  baseRule: BaseRule;
}

export class RuleManager {
  ruleTypes: Record<string, RuleType>;
  rules: Rule[];
  baseRule: BaseRule;

  constructor({ ruleTypes, rules, baseRule}: RuleManagerOptions) {
    this.baseRule = baseRule;
    this.rules = [];
    this.ruleTypes = {
      rest: new RestRule(),
      ...ruleTypes.reduce((acc, curRule) => {
        const tempType = new curRule();

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
    return this.ruleTypes[requestType].handler(request, this.baseRule);
  }
}
