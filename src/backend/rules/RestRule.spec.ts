import express from "express";
import { Rule } from "../../types/Rule";

import { RestRule } from './RestRule';

describe('RestRule', () => {
  it('should match correct path', () => {
    const ruleType = new RestRule();

    const rule = {
      path: '/test-route',
      method: 'POST'
    } as any as Rule;

    const reqOne = { originalUrl: '/test-route/1', method: 'POST' } as express.Request;
    const reqTwo = { originalUrl: '/test-route', method: 'POST' } as express.Request;

    expect(ruleType.isMatch(reqOne, rule)).toBe(false);
    expect(ruleType.isMatch(reqTwo, rule)).toBe(true);
  });

  it('should match correct method', () => {
    const ruleType = new RestRule();

    const rule = {
      path: '/test-route',
      method: 'POST'
    } as any as Rule;

    const reqOne = { originalUrl: '/test-route', method: 'POST' } as express.Request;
    const reqTwo = { originalUrl: '/test-route', method: 'GET' } as express.Request;

    expect(ruleType.isMatch(reqOne, rule)).toBe(true);
    expect(ruleType.isMatch(reqTwo, rule)).toBe(false);
  });

  it('should match ALL method', () => {
    const ruleType = new RestRule();

    const rule = {
      path: '/test-route',
      method: 'ALL'
    } as any as Rule;

    const reqOne = { originalUrl: '/test-route', method: 'POST' } as express.Request;
    const reqTwo = { originalUrl: '/test-route', method: 'GET' } as express.Request;

    expect(ruleType.isMatch(reqOne, rule)).toBe(true);
    expect(ruleType.isMatch(reqTwo, rule)).toBe(true);
  });

  it('should match parameters in path', () => {
    const ruleType = new RestRule();

    const rule = {
      path: '/test-route/:id',
      method: 'POST'
    } as any as Rule;

    const reqOne = { originalUrl: '/test-route/12', method: 'POST' } as express.Request;
    const reqTwo = { originalUrl: '/test-route', method: 'POST' } as express.Request;

    expect(ruleType.isMatch(reqOne, rule)).toBe(true);
    expect(ruleType.isMatch(reqTwo, rule)).toBe(false);
  })

  it('should prevent hijacker from being deployed', () => {
    expect(false).toBe(true);
  })
})