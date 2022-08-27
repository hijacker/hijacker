import { EventEmitter } from 'node:events';
import { Server as NodeServer } from 'node:http';

import { Server } from 'socket.io';

import { HijackerSocketServer } from '../types/Sockets';
import { Logger } from './Logger';

type EventType = 'socket' | 'event-manager' | 'both';

interface EventManagerOptions {
  server: NodeServer;
  logger: Logger;
}

// Wrapper for events.  Will eventually keep track of registered events.
export class EventManager {
  private events: EventEmitter;
  private io: HijackerSocketServer;
  private logger: Logger;

  constructor({ server, logger }: EventManagerOptions) {
    this.events = new EventEmitter();
    this.io = new Server(server, {
      maxHttpBufferSize: 1e8,
      cors: {
        origin: true
      }
    });
    this.logger = logger;
  }

  on(eventName: string, cb: (...args: any[]) => void, type: EventType = 'both') {
    this.logger.log('DEBUG', '[EventManager]', 'on');

    if (type === 'event-manager' || type === 'both') {
      this.events.on(eventName, cb);
    }

    if (type === 'socket' || type === 'both') {
      this.io.on(eventName, cb);
    }
  }

  once(eventName: string, cb: (...args: any[]) => void, type: EventType = 'both') {
    this.logger.log('DEBUG', '[EventManager]', 'once');

    if (type === 'event-manager' || type === 'both') {
      this.events.once(eventName, cb);
    }

    if (type === 'socket' || type === 'both') {
      this.io.once(eventName, cb);
    }
  }

  off(eventName: string, cb: (...args: any[]) => void, type: EventType = 'both') {
    this.logger.log('DEBUG', '[EventManager]', 'off');

    if (type === 'event-manager' || type === 'both') {
      this.events.off(eventName, cb);
    }

    if (type === 'socket' || type === 'both') {
      this.io.off(eventName, cb);
    }
  }

  emit(eventName: string, val: any, type: EventType = 'both') {
    this.logger.log('DEBUG', '[EventManager]', 'emit');

    if (type === 'event-manager' || type === 'both') {
      this.events.emit(eventName, val);
    }

    if (type === 'socket' || type === 'both') {
      this.io.emit(eventName as any, val);
    }
  }

  close() {
    this.logger.log('DEBUG', '[EventManager]', 'close');

    this.io.disconnectSockets();
  }
}