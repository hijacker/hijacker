import { Agent } from 'node:https';

import got, { OptionsOfTextResponseBody } from 'got';
import { OperationDefinitionNode, parse } from 'graphql';

import { HijackerRequest, HijackerResponse, Request } from '../types/Request.js';
import { BaseRule, IRule, Rule } from './Rule.js';
import { RuleType } from './RuleManager.js';

class GraphqlRuleType extends Rule {
  operationName?: string;

  constructor(rule: Partial<IRule & { operationName?: string; }>) {
    super(rule);

    this.operationName = rule.operationName;
  }
}

export class GraphqlRule implements RuleType {
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

  async handler(request: Request, baseRule: BaseRule): Promise<HijackerResponse> {
    const { originalReq, matchingRule } = request;
    const activeRule = matchingRule ?? baseRule;

    const responseObj: HijackerResponse = {
      body: activeRule.body ?? {},
      headers: {},
      statusCode: activeRule.statusCode ?? 200
    };

    const requestOptions: OptionsOfTextResponseBody = {
      method: originalReq.method,
      headers: {
        ...originalReq.headers
      },
      throwHttpErrors: false,
      agent: {
        https: new Agent({
          rejectUnauthorized: false
        })
      },
      hooks: {
        beforeRequest: [
          (req: any) => {
            // console.log({...req});
          }
        ]
      }
    };

    if (originalReq.method !== 'GET') {
      requestOptions.body = JSON.stringify(originalReq.body);
    }

    const url = activeRule.baseUrl + (activeRule.routeTo ?? originalReq.path);

    if (!activeRule.skipApi) {
      const response = await got(url, requestOptions);
      
      let body = response.body;
      try {
        body = JSON.parse(body);
      } catch {}

      responseObj.body = activeRule.body ?? body;
      responseObj.statusCode = activeRule.statusCode ?? response.statusCode;
      responseObj.headers = response.headers as Record<string, string> ?? {};
    }

    return responseObj;
  }
}