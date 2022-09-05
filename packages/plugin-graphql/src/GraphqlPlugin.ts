import { RuleType } from '@hijacker/core/dist/rules/RuleManager';
import { Plugin } from '@hijacker/core/dist/utils/PluginManager';

import { GraphqlRuleType } from './GraphqlRule.js';

interface GraphqlPluginOptions {
  name?: string;
};

export class GraphqlPlugin implements Plugin {
  name: string;
  ruleTypes: RuleType[];

  constructor({ name }: GraphqlPluginOptions) {
    this.name = name ?? 'GraphqlPlugin';
    this.ruleTypes = [new GraphqlRuleType()]
  }
}