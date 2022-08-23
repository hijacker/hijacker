import { BaseRule, Rule } from '../rules/Rule.js';
import { LoggerOptions } from '../utils/Logger.js';
import { Plugin } from '../utils/PluginManager.js';

export interface Config {
  port: number;
  baseRule: BaseRule;
  rules: Partial<Omit<Rule<any>, 'id'>>[];
  plugins?: Plugin[];
  logger?: LoggerOptions;
}
