/* eslint-env jest */

const config = require('../lib/backend/util/config')

test('should return true for valid config file', () => {
  const configObj = {
    base_url: 'https://google.com',
    port: 3000
  }

  expect(config.validate(configObj)).toBe(true)
})

test('should return false if non object config passed', () => {
  const configObj = 'cofnig'

  expect(config.validate(configObj)).toBe(false)
})

test('should return false if no base_url provided', () => {
  const configObj = {
    port: 3000
  }

  expect(config.validate(configObj)).toBe(false)
})
