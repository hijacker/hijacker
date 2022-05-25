import { IRule } from '../rules/Rule.js';

export interface Config {
  port: number;
  baseRule: Partial<IRule>;
  rules: Partial<IRule>[];
}
