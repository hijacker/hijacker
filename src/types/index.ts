import { RuleManager } from '../rules/RuleManager.js';
import { EventManager, HookManager } from '../utils/index.js';
import { Logger } from '../utils/Logger.js';

export interface HijackerContext {
  ruleManager: RuleManager;
  eventManager: EventManager;
  hookManager: HookManager;
  logger: Logger;
}