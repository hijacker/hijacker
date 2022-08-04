import { RuleType } from '../rules/RuleManager';
import { HijackerContext } from '../types';
import { Handler } from './HookManager';

interface PluginManagerOptions {
  context: HijackerContext;
  plugins?: Plugin[];
}

export interface Plugin {
  name: string;
  initPlugin?: (context: HijackerContext) => void;
  hooks?: string[];
  handlers?: Record<string, Handler>;
  ruleTypes?: RuleType[];
}

export class PluginManager {
  plugins: Record<string, Plugin> = {};
  context: HijackerContext;

  constructor({ context, plugins = [] }: PluginManagerOptions) {
    this.context = context;

    plugins.forEach(this.initPlugin.bind(this));

    // Register Hooks
    plugins.forEach(this.registerPluginHooks.bind(this));

    // Register Handlers
    plugins.forEach(this.registerPluginHandlers.bind(this));
  }

  private initPlugin(plugin: Plugin) {
    if (plugin.name in this.plugins) {
      throw new Error('Plugin with name already exists');
    }

    // Initialize plugin
    if (plugin.initPlugin) {
      plugin.initPlugin(this.context);
    }

    this.context.ruleManager.addRuleTypes(plugin.ruleTypes ?? []);

    this.plugins[plugin.name] = plugin;
  }

  private registerPluginHooks(plugin: Plugin) {
    plugin.hooks?.forEach((hook) => {
      this.context.hookManager.registerHook(hook);
    });
  }

  private registerPluginHandlers(plugin: Plugin) {
    for (const [key, val] of Object.entries(plugin.handlers ?? {})) {
      this.context.hookManager.registerHandler(key, val);
    }
  }
}