export * from './EventManager.js';
export * from './headers.js';
export * from './HookManager.js';
export * from './Logger.js';
export * from './PluginManager.js';

export const isPromise = (p: any) => 
  p !== null &&
  typeof p === 'object' &&
  typeof p.then === 'function' &&
  typeof p.catch === 'function';