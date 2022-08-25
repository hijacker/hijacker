export { EventManager } from './EventManager.js';
export { filterResponseHeaders } from './headers.js';
export { HookManager } from './HookManager.js';

export const isPromise = (p: any) => 
  p !== null &&
  typeof p === 'object' &&
  typeof p.then === 'function' &&
  typeof p.catch === 'function';