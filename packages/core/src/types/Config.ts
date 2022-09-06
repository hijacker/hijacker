import type { Rule } from '../rules/index.js';
import type { LoggerOptions, Plugin} from '../utils/index.js';

export interface Config {
  port: number;
  baseRule: Partial<Rule<any>>;
  rules: Partial<Omit<Rule<any>, 'id'>>[];
  plugins?: Plugin[];
  logger?: LoggerOptions;
}
