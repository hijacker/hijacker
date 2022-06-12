import { BaseRule, IRule } from '../rules/Rule.js';

export interface Config {
  port: number;
  baseRule: BaseRule;
  rules: Partial<IRule>[];
}
