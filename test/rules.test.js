let rules = require('../src/backend/util/rules')

test('should add an id to a rule when read in', () => {
  let rule = {
    path: '/test-route',
    method: 'All'
  }

  let readRule = rules.read(rule)

  expect(readRule).toHaveProperty('id')
})

test('should fill in default values for properties not in rule', () => {
  let rule = {
    path: '/test-route'
  }

  let readRule = rules.read(rule)

  expect(readRule).toHaveProperty('disabled', false)
  expect(readRule).toHaveProperty('interceptRequest', false)
  expect(readRule).toHaveProperty('interceptResponse', false)
  expect(readRule).toHaveProperty('skipApi', false)
})
