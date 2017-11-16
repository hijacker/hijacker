/* eslint-env jest */

const axios = require('axios')
const io = require('socket.io-client')
const hijacker = require('../..')

describe('Integration Tests', () => {
  let hijackerServer
  let socket
  let CancelToken

  beforeAll(() => {
    const config = {
      base_url: 'http://hijacker.testing.com',
      port: 2000,
      rules: [
        {
          path: '/cars',
          skipApi: true,
          method: 'GET',
          interceptRequest: true,
          body: {
            test: 'testing'
          }
        },
        {
          path: '/posts',
          skipApi: true,
          method: 'GET',
          interceptResponse: true,
          body: {
            posts: 'get'
          }
        }
      ]
    }

    hijackerServer = hijacker(config)
    CancelToken = axios.CancelToken
  })

  afterAll(() => {
    socket.close()
    hijackerServer.close()
  })

  beforeEach(() => {
    socket = io('http://localhost:2000')
  })

  afterEach(() => {
    socket.close()
  })

  it('should send a socket event on interceptRequest and continue on emit', (done) => {
    let source = CancelToken.source()

    socket.on('intercept', (data) => {
      source.cancel()
      done()
    })

    axios.get('http://localhost:2000/cars', { cancelToken: source.token })
      .then(() => {
        expect(true).toBe(false)
      })
      .catch(() => {})
  })

  it('should send a socket event on interceptResponse and continue on emit', (done) => {
    let source = CancelToken.source()

    socket.on('intercept', (data) => {
      source.cancel()
      done()
    })

    axios.get('http://localhost:2000/posts', { cancelToken: source.token })
      .then(() => {
        expect(true).toBe(false)
      })
      .catch(() => {})
  })

  it('should allow modifying data in interceptRequest')

  it('should allow modifying data in interceptResponse')

  it('should only listen for one reponse from client per intercept')
})
