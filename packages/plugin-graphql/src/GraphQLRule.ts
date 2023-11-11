
import type { HttpRequest, RestRule, Rule } from '@hijacker/core';
import { RestRuleType } from '@hijacker/core';
import { OperationDefinitionNode, parse } from 'graphql';

export type GraphQLRule = RestRule & {
  operationName?: string;
}

export class GraphQLRuleType extends RestRuleType {
  type = 'graphql';

  createRule(rule: Partial<GraphQLRule>) {
    return {
      ...super.createRule(rule),
      operationName: rule.operationName
    };
  }

  isMatch(request: HttpRequest, rule: Rule): boolean {
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