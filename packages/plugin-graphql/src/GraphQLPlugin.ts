import type { RuleType, Plugin } from '@hijacker/core';

import { GraphQLRuleType } from './GraphQLRule.js';

interface GraphQLPluginOptions {
  name?: string;
}

export class GraphQLPlugin implements Plugin {
  name: string;
  ruleTypes: RuleType[];

  constructor({ name }: GraphQLPluginOptions) {
    this.name = name ?? 'GraphQLPlugin';
    this.ruleTypes = [new GraphQLRuleType()];
  }
}