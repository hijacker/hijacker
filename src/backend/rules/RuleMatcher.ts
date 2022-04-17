import express from 'express';
import { Request } from '../../types/Request';
import { Rule } from '../../types/Rule';
import { RestRule } from './RestRule';

export interface RuleType {
  type: string;
  isMatch(request: express.Request, rule: Rule): boolean;
  handler(request: Request): void;
}

export interface RuleTypeConstructor {
  new(): RuleType;
}

export class RuleMatcher {
  ruleTypes: Record<string, RuleType>;

  constructor(ruleTypes: RuleTypeConstructor[]) {
    this.ruleTypes = {
      rest: new RestRule(),
      ...ruleTypes.reduce((acc, cur) => {
        const tempType = new cur();

        return {
          ...acc,
          [tempType.type]: tempType
        }
      }, {})
    }
  }

  match(request: express.Request, rules: Rule[]) {
    return rules.find(r => {
      const ruleType = r.type ?? 'rest';

      return !r.disabled && this.ruleTypes[ruleType].isMatch(request, r);
    });
  }
}
