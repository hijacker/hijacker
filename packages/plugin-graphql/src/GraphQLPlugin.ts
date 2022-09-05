import { RuleType } from '@hijacker/core/dist/rules/RuleManager';
import { Plugin } from '@hijacker/core/dist/utils/PluginManager';

import { GraphQLRuleType } from './GraphQLRule.js';

interface GraphQLPluginOptions {
  name?: string;
};

export class GraphQLPlugin implements Plugin {
  name: string;
  ruleTypes: RuleType[];

  constructor({ name }: GraphQLPluginOptions) {
    this.name = name ?? 'GraphQLPlugin';
    this.ruleTypes = [new GraphQLRuleType()]
  }
}