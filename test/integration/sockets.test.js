/* eslint-env jest */

const io = require('socket.io-client')
const hijacker = require('../..')

describe('Integration Tests', () => {
  let hijackerServer
  let socket

  beforeAll(() => {
    const config = {
      base_url: 'http://hijacker.testing.com',
      port: 4000,
      rules: [
        {
          path: '/cars',
          skipApi: false,
          method: 'POST',
          body: {
            test: 'testing'
          }
        },
        {
          path: '/posts',
          skipApi: true,
          method: 'GET',
          body: {
            posts: 'get'
          }
        },
        {
          path: '/cars',
          skipApi: false,
          method: 'PUT',
          statusCode: 418
        }
      ]
    }

    hijackerServer = hijacker(config)
  })

  afterAll(() => {
    hijackerServer.close()
  })

  beforeEach(() => {
    socket = io('http://localhost:4000')
  })

  afterEach(() => {
    socket.close()
  })

  it('should send list of rules on socket connect', (done) => {
    socket.on('settings', (data) => {
      expect(data.rules.length).toBe(3)
      done()
    })
  })
})
