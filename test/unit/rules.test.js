/* eslint-env jest */

const rules = require('../../lib/util/rules')

describe('Rule module', () => {
  it('should add an id to a rule when read in', () => {
    const rule = {
      path: '/test-route'
    }

    const readRule = rules.read(rule)

    expect(readRule).toHaveProperty('id')
  })

  it('should not change the id when keepId flag set to true', () => {
    const rule = {
      path: '/test-route'
    }

    const readRule = rules.read(rule)
    const tempId = readRule.id
    const newRule = rules.read(readRule, true)

    expect(newRule.id).toBe(tempId)
  })

  it('should change the id when keepId flag set to false', () => {
    const rule = {
      path: '/test-route'
    }

    const readRule = rules.read(rule)
    const tempId = rule.id
    const newRule = rules.read(readRule, false)

    expect(newRule.id).not.toBe(tempId)
  })

  it('should change the id when keepId flag not set', () => {
    const rule = {
      path: '/test-route'
    }

    const readRule = rules.read(rule)
    const tempId = rule.id
    const newRule = rules.read(readRule)

    expect(newRule.id).not.toBe(tempId)
  })

  it('should fill in default values for properties not in rule', () => {
    const rule = {
      path: '/test-route'
    }

    const readRule = rules.read(rule)

    expect(readRule).toHaveProperty('disabled', false)
    expect(readRule).toHaveProperty('interceptRequest', false)
    expect(readRule).toHaveProperty('interceptResponse', false)
    expect(readRule).toHaveProperty('skipApi', false)
  })

  it('should match the correct rule with path and method', () => {
    const ruleList = [
      {
        path: '/test-route',
        method: 'POST'
      },
      {
        path: '/test-route',
        method: 'GET'
      },
      {
        path: '/route',
        method: 'DELETE'
      }
    ]

    // Mock requests just need originalUrl and method
    const reqOne = { originalUrl: '/test-route', method: 'POST' }
    const reqTwo = { originalUrl: '/test-route', method: 'GET' }
    const reqThree = { originalUrl: '/route', method: 'DELETE' }

    expect(rules.match(ruleList, reqOne)).toEqual(ruleList[0])
    expect(rules.match(ruleList, reqTwo)).toEqual(ruleList[1])
    expect(rules.match(ruleList, reqThree)).toEqual(ruleList[2])
  })

  it('should match first result if multiple match', () => {
    const ruleList = [
      {
        path: '/test-route',
        method: 'POST',
        skipApi: true
      },
      {
        path: '/test-route',
        method: 'POST',
        skipApi: false
      }
    ]

    const reqOne = { originalUrl: '/test-route', method: 'POST' }

    expect(rules.match(ruleList, reqOne)).toEqual(ruleList[0])
  })

  it('should ignore disabled rules', () => {
    const ruleList = [
      {
        path: '/test-route',
        method: 'POST',
        skipApi: true,
        disabled: true
      },
      {
        path: '/test-route',
        method: 'POST',
        skipApi: false
      }
    ]

    const reqOne = { originalUrl: '/test-route', method: 'POST' }

    expect(rules.match(ruleList, reqOne)).toEqual(ruleList[1])
  })

  it('should match all methods if none provided in rule', () => {
    const ruleList = [
      {
        path: '/test-route'
      }
    ]

    const reqOne = { originalUrl: '/test-route', method: 'POST' }
    const reqTwo = { originalUrl: '/test-route', method: 'GET' }
    const reqThree = { originalUrl: '/test-route', method: 'DELETE' }
    const reqFour = { originalUrl: '/test-route', method: 'PUT' }
    const reqFive = { originalUrl: '/test-route', method: 'PATCH' }

    expect(rules.match(ruleList, reqOne)).toEqual(ruleList[0])
    expect(rules.match(ruleList, reqTwo)).toEqual(ruleList[0])
    expect(rules.match(ruleList, reqThree)).toEqual(ruleList[0])
    expect(rules.match(ruleList, reqFour)).toEqual(ruleList[0])
    expect(rules.match(ruleList, reqFive)).toEqual(ruleList[0])
  })

  it('should match all methods if method equals ALL', () => {
    const ruleList = [
      {
        method: 'ALL',
        path: '/test-route'
      }
    ]

    const reqOne = { originalUrl: '/test-route', method: 'POST' }
    const reqTwo = { originalUrl: '/test-route', method: 'GET' }
    const reqThree = { originalUrl: '/test-route', method: 'DELETE' }
    const reqFour = { originalUrl: '/test-route', method: 'PUT' }
    const reqFive = { originalUrl: '/test-route', method: 'PATCH' }

    expect(rules.match(ruleList, reqOne)).toEqual(ruleList[0])
    expect(rules.match(ruleList, reqTwo)).toEqual(ruleList[0])
    expect(rules.match(ruleList, reqThree)).toEqual(ruleList[0])
    expect(rules.match(ruleList, reqFour)).toEqual(ruleList[0])
    expect(rules.match(ruleList, reqFive)).toEqual(ruleList[0])
  })

  it('should return default rule if no match', () => {
    const ruleList = [
      {
        path: '/test-route',
        method: 'POST'
      },
      {
        path: '/test-route',
        method: 'GET'
      }
    ]

    const reqOne = { originalUrl: '/test-route', method: 'DELETE' }

    expect(ruleList).not.toContainEqual(rules.match(ruleList, reqOne))
    expect(rules.match(ruleList, reqOne)).toHaveProperty('interceptRequest')
    expect(rules.match(ruleList, reqOne)).toHaveProperty('disabled')
  })
})
