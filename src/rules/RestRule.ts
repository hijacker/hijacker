import { Agent } from 'node:https';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Setup type file for routeMatcher
import { routeMatcher } from 'route-matcher';

import { HijackerRequest, HijackerResponse, Request } from '../types/Request.js';
import { Rule } from './Rule.js';
import { RuleType } from './RuleManager.js';

export class RestRule implements RuleType {
  type = 'rest';

  isMatch(request: HijackerRequest, rule: Rule) {
    return !!routeMatcher(rule.path).parse(request.path) && 
      (!Object.prototype.hasOwnProperty.call(rule, 'method') || rule.method === request.method || rule.method === 'ALL');
  }

  async handler(request: Request): Promise<HijackerResponse> {
    const { originalReq, matchingRule } = request;

    const requestOptions = {
      method: originalReq.method,
      headers: {},
      throwHttpErrors: false,
      agent: {
        https: new Agent({
          rejectUnauthorized: false
        })
      },
      hooks: {
        beforeRequest: [
          (req: any) => {
            console.log({...req});
          }
        ]
      }
    };

    

    // const response = await got(request.originalReq.path, requestOptions);

    // console.log(response);

    return {
      body: request.matchingRule?.body ?? {},
      headers: {},
      statusCode: request.matchingRule?.statusCode ?? 200
    };
  }
}
