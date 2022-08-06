import { HijackerContext } from '../types/index.js';
import { Request, HijackerRequest, HijackerResponse } from '../types/Request.js';
import { GraphqlRule } from './GraphqlRule.js';
import { RestRule } from './RestRule.js';
import { BaseRule, IRule, Rule } from './Rule.js';

export interface RuleType {
  type: string;
  ruleClass?: any;
  isMatch(request: HijackerRequest, rule: Rule): boolean;
  handler(
    request: Request,
    baseRule: BaseRule,
    context: HijackerContext
  ): Promise<HijackerResponse>;
}

interface RuleManagerOptions {
  rules: Partial<IRule>[];
  baseRule: BaseRule;
}

export class RuleManager {
  ruleTypes: Record<string, RuleType> = {};
  rules: Rule[] = [];
  baseRule: BaseRule = {} as BaseRule;

  init({ rules, baseRule }: RuleManagerOptions) {
    this.baseRule = baseRule;
    this.rules = [];
    this.ruleTypes.rest = new RestRule();
    this.ruleTypes.graphql = new GraphqlRule();

    rules.map(r => this.addRule(r));
  }

  addRuleTypes(ruleTypes: RuleType[]) {
    ruleTypes.forEach((ruleType) => {
      this.ruleTypes[ruleType.type] = ruleType;
    });
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

  deleteRule(id: string) {
    this.rules = this.rules.filter(x => x.id !== id);
  }

  match(request: HijackerRequest) {
    return this.rules.find(r => {
      const ruleType = r.type?? this.baseRule.type ?? 'rest';

      return !r.disabled && this.ruleTypes[ruleType].isMatch(request, r);
    });
  }

  async handler(requestType: string, request: Request, context: HijackerContext): Promise<HijackerResponse> {
    // TODO: Check if type has been registered
    
    return this.ruleTypes[requestType].handler(
      request,
      this.baseRule,
      context
    );
  }
}
