import { isPromise } from './index.js';

export type Handler<T = any> = (val: T) => T;

export class HookManager {
  hooks: Record<string, Handler[]>;

  constructor() {
    // Include default hooks
    this.hooks = {
      // Config modification at start
      HIJACKER_START: [],

      // Request to hijacker. Handler<HijackerRequest>
      HIJACKER_REQUEST: [],

      // Request to api server. Handler<Request>
      SERVER_REQUEST: [],

      // Response from server
      SERVER_RESPONSE: [],

      // Response from hijacker. Handler<HijackerResponse>
      HIJACKER_RESPONSE: []
    };
  }

  registerHook(hookName: string) {
    if (hookName in this.hooks) {
      throw new Error('A hook already exists with that name');
    }

    this.hooks[hookName] = [];
  }

  registerHandler(hookName: string, handler: Handler) {
    if (hookName in this.hooks === false) {
      throw new Error('No hook with that name exists');
    }

    this.hooks[hookName].push(handler);
  }

  async executeHook<T = any>(hookName: string, initialVal: T | Promise<T>) {
    if (hookName in this.hooks === false) {
      throw new Error('No hook with that name exists');
    }

    return await this.hooks[hookName].reduce(async (acc, cur) => cur(await acc), initialVal);
  }

  executeSyncHook<T = any>(hookName: string, initialVal: T) {
    if (hookName in this.hooks === false) {
      throw new Error('No hook with that name exists');
    }

    return this.hooks[hookName].reduce((acc, cur) => {
      const val = cur(acc);
      
      if (isPromise(val)) {
        throw new Error(`${hookName} can't handle async handlers`);
      }
      
      return val;
    }, initialVal);
  }
}