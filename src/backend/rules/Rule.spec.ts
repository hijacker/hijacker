import { Rule } from './Rule';

describe('Rule', () => {
  it('should create a rule with given object', () => {
    const rule = new Rule({
      baseUrl: 'http://localhost:1234',
      path: '/123/:test',
      disabled: true,
      interceptRequest: true,
      interceptResponse: true,
      name: 'Test Rule',
      routeTo: '/13',
      skipApi: true,
      method: 'GET',
      body: { hello: 'world' },
      statusCode: 200,
      type: 'graphql',
    })

    expect(rule.baseUrl).toBe('http://localhost:1234');
    expect(rule.path).toBe('/123/:test');
    expect(rule.disabled).toBe(true);
    expect(rule.interceptRequest).toBe(true);
    expect(rule.interceptResponse).toBe(true);
    expect(rule.name).toBe('Test Rule');
    expect(rule.routeTo).toBe('/13');
    expect(rule.skipApi).toBe(true);
    expect(rule.method).toBe('GET');
    expect(rule.body).toEqual({ hello: 'world' });
    expect(rule.statusCode).toBe(200);
    expect(rule.type).toBe('graphql');
  });

  it('should set rule defaults', () => {
    const rule = new Rule({});

    expect(rule.disabled).toBe(false);
    expect(rule.interceptRequest).toBe(false);
    expect(rule.interceptResponse).toBe(false);
    expect(rule.skipApi).toBe(false);
    expect(rule.method).toBe('ALL');
    expect(rule.type).toBe('rest');
  });
});