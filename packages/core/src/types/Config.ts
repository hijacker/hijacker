import type { Rule } from '../rules/index.js';
import type { LoggerOptions } from '../utils/index.js';
import type { Plugin } from '../managers/index.js';

export interface Config {
  port: number;
  baseRule: Partial<Rule<any>>;
  rules: Partial<Omit<Rule<any>, 'id'>>[];
  plugins?: Plugin[];
  logger?: LoggerOptions;
}
