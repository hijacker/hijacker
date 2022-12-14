import type { RuleManager, EventManager, HookManager } from '../managers/index.js';
import type { Logger } from '../utils/index.js';

export interface HijackerContext {
  ruleManager: RuleManager;
  eventManager: EventManager;
  hookManager: HookManager;
  logger: Logger;
}

export * from './Config.js';
export * from './Request.js';