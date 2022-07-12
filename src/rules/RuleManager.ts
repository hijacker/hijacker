import { Newable } from '../types/index.js';
import { Request, HijackerRequest, HijackerResponse } from '../types/Request.js';
import { GraphqlRule } from './GraphqlRule.js';
import { RestRule } from './RestRule.js';
import { BaseRule, IRule, Rule } from './Rule.js';

export class RuleType {
  type = '';
  ruleClass?: any = undefined;

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
      graphql: new GraphqlRule(),
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
    const ruleType = rule.type ?? this.baseRule.type ?? 'rest';
    const ruleClass = this.ruleTypes[ruleType]?.ruleClass ?? Rule;

    this.rules.push(new ruleClass({
      ...this.baseRule,
      ...rule
    }));
  }

  updateRule(rule: Partial<IRule>) {
    const r = this.rules.find(x => x.id === rule.id);

    if (r) {
      r.update(rule);
    }
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
