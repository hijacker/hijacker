import { Agent } from 'node:https';

import got, { OptionsOfTextResponseBody } from 'got';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Setup type file for routeMatcher
import { routeMatcher } from 'route-matcher';
import { v4 as uuid } from 'uuid';

import type { HijackerRequest, RuleType, Rule, HttpMethod, HttpRequest, HttpResponse } from '../schemas/index.js';

export type RestRule = Rule & {
  skipApi: boolean;
  method: HttpMethod | 'ALL';
  body: any;
  path: string;
  statusCode?: number;
  routeTo?: string;
}

export class RestRuleType implements RuleType {
  type = 'rest';
  
  createRule(rule: Partial<RestRule>) {
    return {
      id: rule.id ?? uuid(),
      disabled: rule.disabled ?? false,
      name: rule.name,
      baseUrl: rule.baseUrl ?? '',
      type: rule.type ?? 'rest',
      skipApi: rule.skipApi ?? false,
      method: rule.method ?? 'ALL',
      body: rule.body,
      path: rule.path ?? '',
      statusCode: rule.statusCode,
      routeTo: rule.routeTo
    };
  }

  isMatch(request: HttpRequest, rule: Rule) {
    return !!routeMatcher(rule.path).parse(request.path) && 
      (!Object.prototype.hasOwnProperty.call(rule, 'method') || rule.method === request.method || rule.method === 'ALL');
  }

  async handler(request: HijackerRequest): Promise<HttpResponse> {
    const { httpReq, matchingRule } = request;

    const responseObj: HttpResponse = {
      requestId: httpReq.requestId,
      timestamp: Date.now(),
      body: matchingRule.body ?? {},
      headers: {},
      statusCode: matchingRule.statusCode as number ?? 200
    };

    const requestOptions: OptionsOfTextResponseBody = {
      url: matchingRule.baseUrl + (matchingRule.routeTo ?? httpReq.path),
      method: httpReq.method,
      headers: {
        ...httpReq.headers
      },
      throwHttpErrors: false,
      agent: {
        https: new Agent({
          rejectUnauthorized: false
        })
      },
      hooks: {
        beforeRequest: [
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (req: any) => {
            // console.log({...req});
          }
        ]
      },
      retry: {
        limit: 0
      }
    };

    if (httpReq.method !== 'GET') {
      requestOptions.body = JSON.stringify(httpReq.body);
    }

    if (!matchingRule.skipApi) {
      const response = await got(requestOptions);
      
      let body = response.body;
      try {
        body = JSON.parse(body);
      } catch {}

      responseObj.body = matchingRule.body ?? body;
      responseObj.statusCode = matchingRule.statusCode as number ?? response.statusCode;
      responseObj.headers = response.headers as Record<string, string>;
    }

    return responseObj;
  }
}
