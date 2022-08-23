import { OperationDefinitionNode, parse } from 'graphql';

import { HijackerRequest} from '../types/Request.js';
import { RestRule, RestRuleFields, RestRuleType } from './RestRule.js';
import { Rule } from './Rule.js';

export class GraphqlRule extends RestRule {
  operationName?: string;

  constructor(rule: Partial<Rule<RestRuleFields & { operationName?: string; }>>) {
    super(rule);

    this.operationName = rule.operationName;
  }
}

export class GraphqlRuleType extends RestRuleType {
  type = 'graphql';

  ruleClass = GraphqlRule;

  isMatch(request: HijackerRequest, rule: GraphqlRule): boolean {
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