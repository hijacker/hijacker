import { v4 as uuid } from 'uuid';

import { RestRuleType } from '../rules/index.js';
import type { Rule } from '../rules/index.js';
import type { Request, HijackerContext, HijackerRequest, HijackerResponse } from '../types/index.js';
import type { Logger } from '../utils/index.js';
import type { EventManager } from './index.js';

export interface RuleType<T = any> {
  type: string;
  createRule(rule: Partial<Rule<T>>): Rule<T>;
  isMatch(request: HijackerRequest, rule: Rule<T>): boolean;
  handler(
    request: Request<T>,
    context: HijackerContext
  ): Promise<HijackerResponse>;
}

interface RuleManagerInitOptions {
  baseRule: Partial<Rule<any>>;
  rules: Partial<Rule<any>>[];
}

interface RuleManagerOptions {
  logger: Logger;
  eventManager: EventManager;
}

type ProcessedRule = Partial<Rule> & { id: string };

export class RuleManager {
  ruleTypes: Record<string, RuleType> = {};
  rules: ProcessedRule[] = [];
  baseRule: Partial<Rule<any>> = {};
  logger: Logger;
  events: EventManager;

  constructor({ logger, eventManager }: RuleManagerOptions) {
    this.logger = logger;
    this.events = eventManager;
  }

  init({ rules, baseRule }: RuleManagerInitOptions) {
    this.logger.log('DEBUG', '[RuleManager]', 'init');

    this.baseRule = baseRule;
    this.rules = [];
    this.ruleTypes.rest = new RestRuleType();

    this.addRules(rules);
  }

  addRuleTypes(ruleTypes: RuleType[]) {
    this.logger.log('DEBUG', '[RuleManager]', 'addRuleTypes');

    ruleTypes.forEach((ruleType) => {
      this.ruleTypes[ruleType.type] = ruleType;
    });
  }

  addRules(rules: Partial<Rule<any>>[]) {
    this.logger.log('DEBUG', '[RuleManager]', 'addRules');

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

    this.events.emit('RULES_UPDATED', this.rules);
  }

  updateRule(rule: Partial<Rule<any>>) {
    this.logger.log('DEBUG', '[RuleManager]', 'updateRules');

    const index = this.rules.findIndex(x => x.id === rule.id);
    const ruleType = rule.type ?? this.baseRule.type ?? 'rest';

    if (ruleType in this.ruleTypes === false) {
      throw new Error(`Cannot register rule for non-existant rule type \`${ruleType}\``);
    }

    this.rules[index] = {
      ...this.rules[index],
      ...rule
    };

    this.events.emit('RULES_UPDATED', this.rules);
  }

  deleteRules(ids: string[]) {
    this.logger.log('DEBUG', '[RuleManager]', 'deleteRules');

    this.rules = this.rules.filter(x => !ids.includes(x.id));

    this.events.emit('RULES_UPDATED', this.rules);
  }

  match(request: HijackerRequest) {
    this.logger.log('DEBUG', '[RuleManager]', 'match');

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
    this.logger.log('DEBUG', '[RuleManager]', 'handler');

    if (ruleType in this.ruleTypes === false) {
      throw new Error(`Cannot register rule for non-existant rule type \`${ruleType}\``);
    }
  
    return this.ruleTypes[ruleType].handler(
      request,
      context
    );
  }
}