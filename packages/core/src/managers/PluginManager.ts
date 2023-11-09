import type { RuleType, Handler } from './index.js';
import type { HijackerContext } from '../types/index.js';
import type { Logger } from '../utils/index.js';

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
  logger: Logger;

  constructor({ context, plugins = [] }: PluginManagerOptions) {
    this.context = context;
    this.logger = context.logger;

    plugins.forEach(this.initPlugin.bind(this));

    // Register Hooks
    plugins.forEach(this.registerPluginHooks.bind(this));

    // Register Handlers
    plugins.forEach(this.registerPluginHandlers.bind(this));
  }

  private initPlugin(plugin: Plugin) {
    this.logger.log('DEBUG', '[PluginManager]', 'initPlugin');

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
    this.logger.log('DEBUG', '[PluginManager]', 'registerPluginHooks');

    plugin.hooks?.forEach((hook) => {
      this.context.hookManager.registerHook(hook);
    });
  }

  private registerPluginHandlers(plugin: Plugin) {
    this.logger.log('DEBUG', '[PluginManager]', 'registerPluginHandlers');

    for (const [key, val] of Object.entries(plugin.handlers ?? {})) {
      this.context.hookManager.registerHandler(key, val);
    }
  }
}