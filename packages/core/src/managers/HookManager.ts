import { Config, HttpRequest, HttpResponse } from '../schemas/index.js';
import { isPromise } from '../utils/index.js';

import type { Handler, HookGuard } from '../schemas/index.js';
import type { Logger } from '../utils/index.js';


interface HookManagerOptions {
  logger: Logger;
}

interface HookObject {
  handlers: Handler[];
  guard: HookGuard;
}

export class HookManager {
  hooks: Record<string, HookObject>;
  logger: Logger;

  constructor({ logger }: HookManagerOptions) {
    this.logger = logger;

    // Include default hooks
    this.hooks = {
      // Config modification at start
      HIJACKER_START: {
        handlers: [],
        guard: (config) => Config.safeParse(config).success
      },

      // Request to hijacker. Handler<HttpRequest>
      HIJACKER_REQUEST: {
        handlers: [],
        guard: (request) => HttpRequest.safeParse(request).success
      },

      // Response from hijacker. Handler<HttpResponse>
      HIJACKER_RESPONSE: {
        handlers: [],
        guard: (response) => HttpResponse.safeParse(response).success
      }
    };
  }

  registerHook(hookName: string, guard: HookGuard) {
    this.logger.log('DEBUG', '[HookManager]', 'registerHook');

    if (hookName in this.hooks === false) {
      this.hooks[hookName] = {
        guard,
        handlers: []
      };
    }
  }

  registerHandler(hookName: string, handler: Handler) {
    this.logger.log('DEBUG', '[HookManager]', 'registerHandler');

    if (hookName in this.hooks === false) {
      throw new Error(`Can't register handler for non-existant hook '${hookName}'`);
    }

    this.hooks[hookName].handlers.push(handler);
  }

  async executeHook<T = any>(hookName: string, initialVal: T) {
    this.logger.log('DEBUG', '[HookManager]', 'executeHook');

    if (hookName in this.hooks === false) {
      throw new Error(`Can't execute non-existant hook '${hookName}'`);
    }

    const { handlers, guard } = this.hooks[hookName];

    let val = initialVal;
    
    for (const handler of handlers) {
      const nextVal = await handler(val) as T;

      if (!guard(nextVal)) {
        throw new Error(`A handler for ${hookName} returned an invalid value`);
      }
      
      val = nextVal;
    }
    
    return val;
  }

  executeSyncHook<T = any>(hookName: string, initialVal: T) {
    this.logger.log('DEBUG', '[HookManager]', 'executeSyncHook');

    if (hookName in this.hooks === false) {
      throw new Error(`Can't execute non-existant hook '${hookName}'`);
    }

    const { handlers, guard } = this.hooks[hookName];

    let val = initialVal;

    for (const handler of handlers) {
      const nextVal = handler(val) as T;

      // Throw errors if promise or invalid value.
      // Could be talked into returning acc instead of throwing errors
      if (isPromise(nextVal)) {
        throw new Error(`${hookName} can't handle async handlers`);
      }

      if (!guard(nextVal)) {
        throw new Error(`A handler for ${hookName} returned an invalid value`);
      }
      
      val = nextVal;
    }
    
    return val;
  }
}