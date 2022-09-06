import { OperationDefinitionNode, parse } from 'graphql';

import type { HijackerRequest, RestRule, Rule } from '@hijacker/core';
import { RestRuleType } from '@hijacker/core';

export interface GraphQLRule extends RestRule {
  operationName?: string;
}

export class GraphQLRuleType extends RestRuleType {
  type = 'graphql';

  createRule(rule: Partial<Rule<GraphQLRule>>) {
    return {
      ...super.createRule(rule),
      operationName: rule.operationName
    };
  }

  isMatch(request: HijackerRequest, rule: Rule<GraphQLRule>): boolean {
    try {
      const { definitions } = parse(request.body.query);
      const topOperation = definitions[0] as OperationDefinitionNode;

      if (topOperation.name?.value === rule.operationName) {
        return true;
      }

      return false;
    } catch {
      return false;
    } 
  }
}