import { v4 as uuid } from 'uuid';

import { HijackerContext } from '../types/index.js';
import { Request, HijackerRequest, HijackerResponse } from '../types/Request.js';
import { GraphqlRuleType } from './GraphqlRule.js';
import { RestRuleType } from './RestRule.js';
import { Rule } from './Rule.js';


export interface RuleType<T = any> {
  type: string;
  createRule(rule: Partial<Rule<T>>): Rule<T>;
  isMatch(request: HijackerRequest, rule: Rule<T>): boolean;
  handler(
    request: Request<T>,
    baseRule: Partial<Rule<T>>,
    context: HijackerContext
  ): Promise<HijackerResponse>;
}

interface RuleManagerOptions {
  baseRule: Partial<Rule<any>>;
  rules: Partial<Rule<any>>[];
}

type ProcessedRule = Partial<Rule> & { id: string };

export class RuleManager {
  ruleTypes: Record<string, RuleType> = {};
  rules: ProcessedRule[] = [];
  baseRule: Partial<Rule<any>> = {};

  init({ rules, baseRule }: RuleManagerOptions) {
    this.baseRule = baseRule;
    this.rules = [];
    this.ruleTypes.rest = new RestRuleType();
    this.ruleTypes.graphql = new GraphqlRuleType();

    this.addRules(rules);
  }

  addRuleTypes(ruleTypes: RuleType[]) {
    ruleTypes.forEach((ruleType) => {
      this.ruleTypes[ruleType.type] = ruleType;
    });
  }

  addRules(rules: Partial<Rule<any>>[]) {
    for (const rule of rules) {
      const ruleType = rule.type ?? this.baseRule.type ?? 'rest';
  
      if (ruleType in this.ruleTypes === false) {
        throw new Error(`Cannot register rule for non-existant rule type \`${ruleType}\``);
      }

      this.rules.push({
        id: uuid(),
        ...rule
      });
    }
  }

  updateRule(rule: Partial<Rule<any>>) {
    const index = this.rules.findIndex(x => x.id === rule.id);
    const ruleType = rule.type ?? this.baseRule.type ?? 'rest';

    if (ruleType in this.ruleTypes === false) {
      throw new Error(`Cannot register rule for non-existant rule type \`${ruleType}\``);
    }

    this.rules[index] = {
      ...this.rules[index],
      ...rule
    };
  }

  deleteRule(id: string) {
    this.rules = this.rules.filter(x => x.id !== id);
  }

  match(request: HijackerRequest) {
    const rule = this.rules.find(r => {
      const ruleType = r.type ?? this.baseRule.type ?? 'rest';

      const withBaseRule = this.ruleTypes[ruleType].createRule({
        ...this.baseRule,
        ...r
      });

      return !r.disabled && this.ruleTypes[ruleType].isMatch(request, withBaseRule);
    });

    const ruleType = rule?.type ?? this.baseRule.type ?? 'rest';

    return this.ruleTypes[ruleType].createRule({
      ...this.baseRule,
      ...rule
    });
  }

  async handler(ruleType: string, request: Request, context: HijackerContext): Promise<HijackerResponse> {
    if (ruleType in this.ruleTypes === false) {
      throw new Error(`Cannot register rule for non-existant rule type \`${ruleType}\``);
    }
  
    return this.ruleTypes[ruleType].handler(
      request,
      this.baseRule,
      context
    );
  }
}
