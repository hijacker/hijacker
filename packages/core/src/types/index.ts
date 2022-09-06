import type { RuleManager } from '../rules/index.js';
import type { EventManager, HookManager, Logger } from '../utils/index.js';

export interface HijackerContext {
  ruleManager: RuleManager;
  eventManager: EventManager;
  hookManager: HookManager;
  logger: Logger;
}

export * from './Config.js';
export * from './Request.js';
export * from './Sockets.js';