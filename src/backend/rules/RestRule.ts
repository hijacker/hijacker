import express from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Setup type file for routeMatcher
import { routeMatcher } from 'route-matcher';

import { Rule } from '../../types/Rule';
import { RuleType } from './RuleMatcher';

export class RestRule implements RuleType {
  type = 'rest';

  isMatch(request: express.Request, rule: Rule) {
    return !!routeMatcher(rule.path).parse(request.originalUrl) && 
      (!Object.prototype.hasOwnProperty.call(rule, 'method') || rule.method === request.method || rule.method === 'ALL');
  }

  handler() {
    throw new Error('Not yet implemented');
  }
}
