import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HookManager } from './HookManager.js';

describe('HookManager', () => {
  let hookManager: HookManager;

  beforeEach(() => {
    hookManager = new HookManager({
      logger: {
        level: 'NONE',
        log: vi.fn()
      }
    });
  });

  it('should register a hook', () => {
    expect.assertions(5);

    // default hooks
    expect(Object.keys(hookManager.hooks)).toContain('HIJACKER_START');
    expect(Object.keys(hookManager.hooks)).toContain('HIJACKER_REQUEST');
    expect(Object.keys(hookManager.hooks)).toContain('HIJACKER_RESPONSE');

    hookManager.registerHook('REQUEST', () => true);

    expect(hookManager.hooks).toHaveProperty('REQUEST');
    expect(hookManager.hooks['REQUEST'].handlers).toEqual([]);
  });

  it('should allow registering handlers', () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST', () => true);
    hookManager.registerHandler('REQUEST', () => null);

    expect(hookManager.hooks['REQUEST'].handlers.length).toEqual(1);
  });

  it('should not allow registering handlers for hooks that don\'t exist', () => {
    expect.assertions(1);

    expect(() => {
      hookManager.registerHandler('REQUEST', () => null);
    }).toThrow('Can\'t register handler for non-existant hook \'REQUEST\'');
  });

  it('should execute handler on value', async () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST', () => true);
    hookManager.registerHandler('REQUEST', (val) => val + 3);

    const val = await hookManager.executeHook('REQUEST', 1);

    expect(val).toEqual(4);
  });

  it('should execute handlers in order they were registered', async () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST', () => true);
    hookManager.registerHandler('REQUEST', (val) => val + 3);
    hookManager.registerHandler('REQUEST', (val) => val * 3);

    const val = await hookManager.executeHook('REQUEST', 1);

    expect(val).toEqual(12);
  });

  it('should allow mix of promise and non-promise handlers', async () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST', () => true);
    hookManager.registerHandler('REQUEST', async (val) => new Promise((resolve) => {
      setTimeout(() => {
        resolve(val + 3);
      }, 400)
    }));
    hookManager.registerHandler('REQUEST', (val) => val * 3);
    
    const val = await hookManager.executeHook('REQUEST', 1);

    expect(val).toEqual(12);
  });

  it('should error out when tring to execute non existant hook', () => {
    expect.assertions(1);

    expect(hookManager.executeHook('REQUEST', 'test'))
      .rejects.toThrow('Can\'t execute non-existant hook \'REQUEST\'');
  });

  it('should execute handlers in order they were registered sync hook', async () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST', () => true);
    hookManager.registerHandler('REQUEST', (val) => val + 3);
    hookManager.registerHandler('REQUEST', (val) => val * 3);

    const val = hookManager.executeSyncHook('REQUEST', 1);

    expect(val).toEqual(12);
  });

  it('should error out when tring to execute non existant sync hook', () => {
    expect.assertions(1);

    expect(() => {
      hookManager.executeSyncHook('REQUEST', 'test');
    }).toThrow('Can\'t execute non-existant hook \'REQUEST\'');
  });

  it('should throw error when async handler registered for a sync hook', () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST', () => true);
    hookManager.registerHandler('REQUEST', (val) => val + 3);
    hookManager.registerHandler('REQUEST', async (val) => val * 3);

    expect(() => {
      hookManager.executeSyncHook('REQUEST', 'test');
    }).toThrow('REQUEST can\'t handle async handlers');
  });

  it('should throw error if handler result does not pass hook guard', async () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST', (val) => typeof val === 'number');
    hookManager.registerHandler('REQUEST', (val) => val + 3);
    hookManager.registerHandler('REQUEST', () => 'testing');

    expect(hookManager.executeHook('REQUEST', 1))
      .rejects.toThrow('A handler for REQUEST returned an invalid value');
  });

  it('should throw error if handler result does not pass hook guard sync hook', async () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST', (val) => typeof val === 'number');
    hookManager.registerHandler('REQUEST', (val) => val + 3);
    hookManager.registerHandler('REQUEST', () => 'testing');

    expect(() => {
      hookManager.executeSyncHook('REQUEST', 1);
    }).toThrow('A handler for REQUEST returned an invalid value');
  });
});