import { BaseRule, IRule } from '../rules/Rule.js';
import { Plugin } from '../utils/PluginManager.js';

export interface Config {
  port: number;
  baseRule: BaseRule;
  rules: Partial<IRule>[];
  plugins?: Plugin[];
}
