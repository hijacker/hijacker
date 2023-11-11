import { Handler } from '../schemas/index.js';
import { isPromise } from '../utils/index.js';
import type { Logger } from '../utils/index.js';

interface HookManagerOptions {
  logger: Logger;
}

export class HookManager {
  hooks: Record<string, Handler[]>;
  logger: Logger;

  constructor({ logger }: HookManagerOptions) {
    this.logger = logger;

    // Include default hooks
    this.hooks = {
      // Config modification at start
      HIJACKER_START: [],

      // Request to hijacker. Handler<HijackerRequest>
      HIJACKER_REQUEST: [],

      // Response from hijacker. Handler<HijackerResponse>
      HIJACKER_RESPONSE: []
    };
  }

  registerHook(hookName: string) {
    this.logger.log('DEBUG', '[HookManager]', 'registerHook');

    if (hookName in this.hooks === false) {
      this.hooks[hookName] = [];
    }
  }

  registerHandler(hookName: string, handler: Handler) {
    this.logger.log('DEBUG', '[HookManager]', 'registerHandler');

    if (hookName in this.hooks === false) {
      throw new Error(`Can't register handler for non-existant hook '${hookName}'`);
    }

    this.hooks[hookName].push(handler);
  }

  async executeHook<T = any>(hookName: string, initialVal: T | Promise<T>) {
    this.logger.log('DEBUG', '[HookManager]', 'executeHook');

    if (hookName in this.hooks === false) {
      throw new Error(`Can't execute non-existant hook '${hookName}'`);
    }

    return await this.hooks[hookName].reduce(async (acc, cur) => cur(await acc) as T, initialVal);
  }

  executeSyncHook<T = any>(hookName: string, initialVal: T) {
    this.logger.log('DEBUG', '[HookManager]', 'executeSyncHook');

    if (hookName in this.hooks === false) {
      throw new Error(`Can't execute non-existant hook '${hookName}'`);
    }

    return this.hooks[hookName].reduce((acc, cur) => {
      const val = cur(acc);
      
      if (isPromise(val)) {
        throw new Error(`${hookName} can't handle async handlers`);
      }
      
      return val as T;
    }, initialVal);
  }
}