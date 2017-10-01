/* eslint-env jest */

const rules = require('../lib/backend/util/rules')

test('should add an id to a rule when read in', () => {
  const rule = {
    path: '/test-route'
  }

  const readRule = rules.read(rule)

  expect(readRule).toHaveProperty('id')
})

test('should fill in default values for properties not in rule', () => {
  const rule = {
    path: '/test-route'
  }

  const readRule = rules.read(rule)

  expect(readRule).toHaveProperty('disabled', false)
  expect(readRule).toHaveProperty('interceptRequest', false)
  expect(readRule).toHaveProperty('interceptResponse', false)
  expect(readRule).toHaveProperty('skipApi', false)
})

test('should match the correct rule with path and method', () => {
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

test('should match first result if multiple match', () => {
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

test('should ignore disabled rules', () => {
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

test('should match all methods if none provided in rule', () => {
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

test('should return default rule if no match', () => {
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
