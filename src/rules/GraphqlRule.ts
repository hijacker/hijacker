import { OperationDefinitionNode, parse } from 'graphql';

import { HijackerRequest} from '../types/Request.js';
import { RestRule, RestRuleType } from './RestRule.js';
import { Rule } from './Rule.js';

export interface GraphqlRule extends RestRule {
  operationName?: string;
}

export class GraphqlRuleType extends RestRuleType {
  type = 'graphql';

  createRule(rule: Partial<Rule<GraphqlRule>>) {
    return {
      ...super.createRule(rule),
      operationName: rule.operationName
    };
  }

  isMatch(request: HijackerRequest, rule: Rule<GraphqlRule>): boolean {
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