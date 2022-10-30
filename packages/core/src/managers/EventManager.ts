import { EventEmitter } from 'node:events';
import { Server as NodeServer } from 'node:http';

import type { Logger } from '../utils/index.js';

interface EventManagerOptions {
  server: NodeServer;
  logger: Logger;
}

// Wrapper for events.  Will eventually keep track of registered events.
export class EventManager {
  private events: EventEmitter;
  private logger: Logger;

  constructor({ server, logger }: EventManagerOptions) {
    this.events = new EventEmitter();
    this.logger = logger;
  }

  on(eventName: string, cb: (...args: any[]) => void) {
    this.logger.log('DEBUG', '[EventManager]', 'on');

    this.events.on(eventName, cb);
  }

  once(eventName: string, cb: (...args: any[]) => void) {
    this.logger.log('DEBUG', '[EventManager]', 'once');

    this.events.once(eventName, cb);
  }

  off(eventName: string, cb: (...args: any[]) => void) {
    this.logger.log('DEBUG', '[EventManager]', 'off');

    this.events.off(eventName, cb);
  }

  emit(eventName: string, val: any) {
    this.logger.log('DEBUG', '[EventManager]', 'emit');

    this.events.emit(eventName, val);
  }
}