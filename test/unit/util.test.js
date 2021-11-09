/* eslint-env jest */

const util = require('../../lib/util/util')

describe('Util module', () => {
  it('should add an increasing count number to every request', () => {
    const countMiddleware = util.requestCount()
    const req = {}
    const res = {}
    const next = jest.fn()

    countMiddleware(req, res, next)

    // Next gets called and adds requestNum to req
    expect(next.mock.calls.length).toBe(1)
    expect(req.requestNum).toBe(1)

    countMiddleware(req, res, next)
    countMiddleware(req, res, next)
    countMiddleware(req, res, next)

    expect(next.mock.calls.length).toBe(4)
    expect(req.requestNum).toBe(4)
  })

  it('should filter hop by hop filters out of headers', () => {
    const headers = {
      'content-type': 'application/json',
      'content-length': 348,
      'connection': 'close, test-header',
      'te': 'testing',
      'transfer-encoding': 'test1',
      'test-header': 'test-header',
      'keep-alive': 'keep-alive',
      'proxy-authorization': 'proxy-authorization',
      'proxy-authentication': 'proxy-authentication',
      'trailer': 'trailer',
      'upgrade': 'upgrade'
    }

    const filteredHeaders = util.filterResponseHeaders(headers)

    // Headers should only contain content-type and content-length
    expect(Object.keys(filteredHeaders).length).toBe(2)
    expect(filteredHeaders['content-type']).toBe('application/json')
    expect(filteredHeaders['content-length']).toBe(348)
  })
})
