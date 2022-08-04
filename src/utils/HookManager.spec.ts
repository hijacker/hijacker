import { beforeEach, describe, expect, it } from 'vitest';

import { HookManager } from './HookManager';

describe('HookManager', () => {
  let hookManager: HookManager;

  beforeEach(() => {
    hookManager = new HookManager();
  });

  it('should register a hook', () => {
    expect.assertions(3);

    // default hooks
    expect(hookManager.hooks).toEqual({
      HIJACKER_START: [],
      HIJACKER_REQUEST: [],
      SERVER_REQUEST: [],
      SERVER_RESPONSE: [],
      HIJACKER_RESPONSE: []
    });

    hookManager.registerHook('REQUEST');

    expect(hookManager.hooks).toHaveProperty('REQUEST');
    expect(hookManager.hooks['REQUEST']).toEqual([]);
  });

  it('should not allow registering hook if one with same name already exists', () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST');
    expect(() => {
      hookManager.registerHook('REQUEST');
    }).toThrow('A hook already exists with that name');
  });

  it('should allow registering handlers', () => {
    expect.assertions(1);

    hookManager.registerHook('REQUEST');
    hookManager.registerHandler('REQUEST', (val) => null);

    expect(hookManager.hooks['REQUEST'].length).toEqual(1);
  });

  it('should not allow registering handlers for hooks that don\'t exist', () => {
    expect.assertions(1);

    expect(() => {
      hookManager.registerHandler('REQUEST', () => null);
    }).toThrow('No hook with that name exists');
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
      .rejects.toThrow('No hook with that name exists');
  });
});