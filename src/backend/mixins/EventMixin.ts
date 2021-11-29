import { EventEmitter } from "events";

export class EventMixin {
  // @ts-ignore
  private events: EventEmitter;

  _initEvents() {
    this.events = new EventEmitter();
  }

  on(eventName: string, cb: () => void) {
    this.events.on(eventName, cb)
  }

  once(eventName: string, cb: () => void) {
    this.events.once(eventName, cb)
  }

  off(eventName: string, cb: () => void) {
    this.events.off(eventName, cb)
  }

  _emit(eventName: string, val: any) {
    this.events.emit(eventName, val)
  }
}