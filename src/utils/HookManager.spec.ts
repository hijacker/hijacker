import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HookManager } from './HookManager';

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
    expect.assertions(3);

    // default hooks
    expect(hookManager.hooks).toEqual({
      HIJACKER_START: [],
      HIJACKER_REQUEST: [],
      HIJACKER_RESPONSE: []
    });

    hookManager.registerHook('REQUEST');

    expect(hookManager.hooks).toHaveProperty('REQUEST');
    expect(hookManager.hooks['REQUEST']).toEqual([]);
  });

  it('should allow registering handlers', () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST');
    hookManager.registerHandler('REQUEST', () => null);

    expect(hookManager.hooks['REQUEST'].length).toEqual(1);
  });

  it('should not allow registering handlers for hooks that don\'t exist', () => {
    expect.assertions(1);

    expect(() => {
      hookManager.registerHandler('REQUEST', () => null);
    }).toThrow('Can\'t register handler for non-existant hook \'REQUEST\'');
  });

  it('should execute handler on value', async () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST');
    hookManager.registerHandler('REQUEST', (val) => val + 3);

    const val = await hookManager.executeHook('REQUEST', 1);

    expect(val).toEqual(4);
  });

  it('should execute handlers in order they were registered', async () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST');
    hookManager.registerHandler('REQUEST', (val) => val + 3);
    hookManager.registerHandler('REQUEST', (val) => val * 3);

    const val = await hookManager.executeHook('REQUEST', 1);

    expect(val).toEqual(12);
  });

  it('should error out when tring to execute non existant hook', () => {
    expect.assertions(1);

    expect(hookManager.executeHook('REQUEST', () => null))
      .rejects.toThrow('Can\'t execute non-existant hook \'REQUEST\'');
  });

  it('should execute handlers in order they were registered', async () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST');
    hookManager.registerHandler('REQUEST', (val) => val + 3);
    hookManager.registerHandler('REQUEST', (val) => val * 3);

    const val = hookManager.executeSyncHook('REQUEST', 1);

    expect(val).toEqual(12);
  });

  it('should error out when tring to execute non existant sync hook', () => {
    expect.assertions(1);

    expect(() => {
      hookManager.executeSyncHook('REQUEST', () => null);
    }).toThrow('Can\'t execute non-existant hook \'REQUEST\'');
  });

  it('should throw error when async handler registered for a sync hook', () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST');
    hookManager.registerHandler('REQUEST', (val) => val + 3);
    hookManager.registerHandler('REQUEST', async (val) => val * 3);

    expect(() => {
      hookManager.executeSyncHook('REQUEST', () => null);
    }).toThrow('REQUEST can\'t handle async handlers');
  });
});