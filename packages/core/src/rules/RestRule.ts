import { Agent } from 'node:https';

import got, { OptionsOfTextResponseBody } from 'got';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Setup type file for routeMatcher
import { routeMatcher } from 'route-matcher';
import { v4 as uuid } from 'uuid';

import type { HijackerRequest, HijackerResponse, Request } from '../types/index.js';
import type { Rule } from './index.js';
import type { RuleType } from '../managers/index.js';

export type HttpMethod =
  'GET' |
  'HEAD' |
  'POST' |
  'PUT' |
  'DELETE' |
  'OPTIONS' |
  'TRACE' |
  'PATCH';

export interface RestRule {
  skipApi: boolean;
  method: HttpMethod | 'ALL';
  body: any;
  path: string;
  statusCode?: number;
  routeTo?: string;
}

export class RestRuleType implements RuleType<RestRule> {
  type = 'rest';
  
  createRule(rule: Partial<Rule<RestRule>>) {
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

  isMatch(request: HijackerRequest, rule: Rule<RestRule>) {
    return !!routeMatcher(rule.path).parse(request.path) && 
      (!Object.prototype.hasOwnProperty.call(rule, 'method') || rule.method === request.method || rule.method === 'ALL');
  }

  async handler(request: Request<RestRule>): Promise<HijackerResponse> {
    const { originalReq, matchingRule } = request;

    const responseObj: HijackerResponse = {
      body: matchingRule.body ?? {},
      headers: {},
      statusCode: matchingRule.statusCode ?? 200
    };

    const requestOptions: OptionsOfTextResponseBody = {
      url: matchingRule.baseUrl + (matchingRule.routeTo ?? originalReq.path),
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

    if (originalReq.method !== 'GET') {
      requestOptions.body = JSON.stringify(originalReq.body);
    }

    if (!matchingRule.skipApi) {
      const response = await got(requestOptions);
      
      let body = response.body;
      try {
        body = JSON.parse(body);
      } catch {}

      responseObj.body = matchingRule.body ?? body;
      responseObj.statusCode = matchingRule.statusCode ?? response.statusCode;
      responseObj.headers = response.headers as Record<string, string>;
    }

    return responseObj;
  }
}
