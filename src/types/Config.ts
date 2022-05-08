import { IRule } from '../backend/rules/Rule';

export interface Config {
  port: number;
  baseRule: Partial<IRule>;
  rules: Partial<IRule>[];
}
