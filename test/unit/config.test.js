/* eslint-env jest */

const config = require('../../lib/util/config')

describe('Config module', () => {
  it('should return config object for valid config file', () => {
    const configObj = {
      base_url: 'https://google.com',
      port: 3000
    }

    expect(typeof config.read(configObj)).toBe('object')
  })

  it('should throw error if non object config passed', () => {
    const configObj = 'config'

    expect(() => config.read(configObj)).toThrow()
  })

  it('should throw error if no base_url provided', () => {
    const configObj = {
      port: 3000
    }

    expect(() => config.read(configObj)).toThrow()
  })
})
