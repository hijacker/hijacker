import { Agent } from 'node:https';

import got, { OptionsOfTextResponseBody } from 'got';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Setup type file for routeMatcher
import { routeMatcher } from 'route-matcher';
import { v4 as uuid } from 'uuid';

import { HijackerRequest, HijackerResponse, Request } from '../types/Request.js';
import { BaseRule, Rule } from './Rule.js';
import { RuleType } from './RuleManager.js';

export type HttpMethod =
  'GET' |
  'HEAD' |
  'POST' |
  'PUT' |
  'DELETE' |
  'OPTIONS' |
  'TRACE' |
  'PATCH';

export interface RestRuleFields {
  id: string;
  skipApi: boolean;
  method: HttpMethod | 'ALL';
  body: any;
  path: string;
  statusCode?: number;
  routeTo?: string;
}

export class RestRule implements Rule<RestRuleFields> {
  id: string;
  disabled?: boolean;
  name?: string;
  baseUrl: string;
  type: string;
  skipApi: boolean;
  method: HttpMethod | 'ALL';
  body: any;
  path: string;
  statusCode?: number;
  routeTo?: string;

  constructor(rule: Partial<Rule<RestRuleFields>>) {
    this.id = rule.id ?? uuid();
    this.disabled = rule.disabled ?? false;
    this.name = rule.name;
    this.baseUrl = rule.baseUrl ?? '';
    this.type = rule.type ?? 'rest';
    this.skipApi = rule.skipApi ?? false;
    this.method = rule.method ?? 'ALL';
    this.body = rule.body;
    this.path = rule.path ?? '';
    this.statusCode = rule.statusCode;
    this.routeTo = rule.routeTo;
  }
}

export class RestRuleType implements RuleType<RestRule> {
  type = 'rest';
  ruleClass = RestRule;

  isMatch(request: HijackerRequest, rule: RestRule) {
    return !!routeMatcher(rule.path).parse(request.path) && 
      (!Object.prototype.hasOwnProperty.call(rule, 'method') || rule.method === request.method || rule.method === 'ALL');
  }

  async handler(request: Request<RestRule>, baseRule: BaseRule<RestRule>): Promise<HijackerResponse> {
    const { originalReq, matchingRule } = request;
    const activeRule = matchingRule ?? baseRule;

    const responseObj: HijackerResponse = {
      body: activeRule.body ?? {},
      headers: {},
      statusCode: activeRule.statusCode ?? 200
    };

    const requestOptions: OptionsOfTextResponseBody = {
      url: activeRule.baseUrl + (activeRule.routeTo ?? originalReq.path),
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

    if (!activeRule.skipApi) {
      const response = await got(requestOptions);
      
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
