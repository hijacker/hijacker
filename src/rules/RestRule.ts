import { Agent } from 'node:https';

import got, { OptionsOfTextResponseBody } from 'got';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Setup type file for routeMatcher
import { routeMatcher } from 'route-matcher';

import { HijackerRequest, HijackerResponse, Request } from '../types/Request.js';
import { BaseRule, Rule } from './Rule.js';
import { RuleType } from './RuleManager.js';

export class RestRule implements RuleType {
  type = 'rest';

  isMatch(request: HijackerRequest, rule: Rule) {
    return !!routeMatcher(rule.path).parse(request.path) && 
      (!Object.prototype.hasOwnProperty.call(rule, 'method') || rule.method === request.method || rule.method === 'ALL');
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
