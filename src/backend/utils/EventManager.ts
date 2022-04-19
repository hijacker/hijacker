import { EventEmitter } from 'events';

// Wrapper for events.  Will eventually keep track of registered events.
export class EventManager {
  private events: EventEmitter;

  constructor() {
    this.events = new EventEmitter();
  }

  on(eventName: string, cb: () => void) {
    this.events.on(eventName, cb);
  }

  once(eventName: string, cb: () => void) {
    this.events.once(eventName, cb);
  }

  off(eventName: string, cb: () => void) {
    this.events.off(eventName, cb);
  }

  emit(eventName: string, val: any) {
    this.events.emit(eventName, val);
  }
}