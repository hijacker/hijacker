import { EventEmitter } from 'node:events';
import { Server as NodeServer } from 'node:http';

import { Server } from 'socket.io';
import { HijackerSocketServer } from '../types/Sockets';

type EventType = 'socket' | 'event-manager' | 'both';
// Wrapper for events.  Will eventually keep track of registered events.
export class EventManager {
  private events: EventEmitter;
  private io: HijackerSocketServer;

  constructor(server: NodeServer) {
    this.events = new EventEmitter();
    this.io = new Server(server, {
      maxHttpBufferSize: 1e8,
      cors: {
        origin: true
      }
    });
  }

  on(eventName: string, cb: (...args: any[]) => void, type: EventType = 'both') {
    if (type === 'event-manager' || type === 'both') {
      this.events.on(eventName, cb);
    }

    if (type === 'socket' || type === 'both') {
      this.io.on(eventName, cb);
    }
  }

  once(eventName: string, cb: (...args: any[]) => void, type: EventType = 'both') {
    if (type === 'event-manager' || type === 'both') {
      this.events.once(eventName, cb);
    }

    if (type === 'socket' || type === 'both') {
      this.io.once(eventName, cb);
    }
  }

  off(eventName: string, cb: (...args: any[]) => void, type: EventType = 'both') {
    if (type === 'event-manager' || type === 'both') {
      this.events.off(eventName, cb);
    }

    if (type === 'socket' || type === 'both') {
      this.io.off(eventName, cb);
    }
  }

  emit(eventName: string, val: any, type: EventType = 'both') {
    if (type === 'event-manager' || type === 'both') {
      this.events.emit(eventName, val);
    }

    if (type === 'socket' || type === 'both') {
      this.io.emit(eventName as any, val);
    }
  }

  close() {
    this.io.disconnectSockets();
  }
}