---
sidebar_position: 1
---

# Plugins
Hijacker was designed with extensibility in mind. Plugins can be made in order to modify or add functionality. The two main ways to extend Hijacker are with custom rule types and hooks. A plugin is made up of the following:

| Property | Description | Type | Required | Default |
| -------- | ----------- | ---- | -------- | ------- |
| `name` | Name of plugin | string | `yes` | |
| `initPlugin` | Function called to initialize plugin and pass HijackerContext | `(context: HijackerContext) => void` | `no` | |
| `hooks` | Array of hook names that the plugin allows to be hooked into | `string[]` | `no` | |
| `handlers` | List of hook handlers for plugin | `Record<string, function>` | `no` | |
| `ruleTypes` | Array of custom rule types | `RuleType[]` | `no` | |


## initPlugin
The `initPlugin` is called after all plugins have been registered and it recieves the `HijackerContext`, which consists of references to the Logger, PluginManager, EventManger, and HookManager. This allows direct access to the internals of hijacker, however it is advised to not use any of the Managers directly unless you absolutely know what you are doing.

