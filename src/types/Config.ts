import { Rule } from '../backend/rules/Rule';

export interface Config {
  port: number;
  baseRule: Partial<Rule>;
  rules: Rule[];
}
