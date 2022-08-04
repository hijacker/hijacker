import { RuleManager } from '../rules/RuleManager.js';
import { EventManager, HookManager } from '../utils/index.js';

export interface HijackerContext {
  ruleManager: RuleManager;
  eventManager: EventManager;
  hookManager: HookManager;
}