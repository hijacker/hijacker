---
sidebar_position: 2
---

# Hooks
Hooks allow plugins to listen and modify objects at specific points in the request lifecycle. 

## Handlers
Handlers are functions that plugins can register to run at hooks. Hook handlers are passed an object that they can modify and return an object of the same shape. 

In order to register a handler, add an entry to the `handlers` property in a plugin where the key is the name of the hook, and the value is the function that you want executed.

## Built-In Hooks
The following hooks are built in to hijacker.

| Hook Name | Type | Description | Synchronous |
| --------- | ---- | ----------- | ----------- |
| `HIJACKER_START` | `Config` | Executed when hijacker starts up and allows modifying the hijacker config | `yes` |
| `HIJACKER_REQUEST` | `HijackerRequst` |  Begining of request. Called before rule matched | `no` |
| `HIJACKER_RESPONSE` | `HijackerResponse` | Called after request handler, before response returned to client | `no` | 

## Create New Hook
It is possible to set up a hook in your plugin so that other plugins can customize it's functionality with the `HookManger`. There are just two steps to setting up a hook:
1. Register the hook name in the `hooks` array in your plugin.
2. Call the `executeHook` function in your plugin where you want the handlers to be executed.
   - `executeSyncHook` can also be used where you are unable to use async/await (eg. a constructor)


  ```typescript
  const modifiedData = await this.hookManager.executeHook('EXAMPLE_HOOK', initialData);
  ```