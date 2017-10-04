/* eslint-env jest */

const config = require('../lib/backend/util/config')

test('should return config object for valid config file', () => {
  const configObj = {
    base_url: 'https://google.com',
    port: 3000
  }

  expect(typeof config.read(configObj)).toBe('object')
})

test('should throw error if non object config passed', () => {
  const configObj = 'config'

  expect(() => config.read(configObj)).toThrow()
})

test('should throw error if no base_url provided', () => {
  const configObj = {
    port: 3000
  }

  expect(() => config.read(configObj)).toThrow()
})
