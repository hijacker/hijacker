import { EventEmitter } from 'events';

// TODO: Remove mixin pattern. Don't like this
export class EventMixin {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private events: EventEmitter;

  _initEvents() {
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

  _emit(eventName: string, val: any) {
    this.events.emit(eventName, val);
  }
}