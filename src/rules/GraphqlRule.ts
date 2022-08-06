import { OperationDefinitionNode, parse } from 'graphql';

import { HijackerRequest} from '../types/Request.js';
import { RestRule } from './RestRule.js';
import { IRule, Rule } from './Rule.js';

export class GraphqlRuleType extends Rule {
  operationName?: string;

  constructor(rule: Partial<IRule & { operationName?: string; }>) {
    super(rule);

    this.operationName = rule.operationName;
  }

  update(rule: Partial<IRule & { operationName?: string; }>): void {
    super.update(rule);

    this.operationName = rule.operationName ?? this.operationName;
  }
}

export class GraphqlRule extends RestRule {
  type = 'graphql';

  ruleClass = GraphqlRuleType;

  isMatch(request: HijackerRequest, rule: GraphqlRuleType): boolean {
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