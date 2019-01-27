/* eslint-env jest */

const axios = require('axios')
const io = require('socket.io-client')

const Hijacker = require('../..')

describe('Intercept Tests', () => {
  const { CancelToken } = axios
  let hijackerServer
  let socket

  beforeAll(() => {
    const config = {
      base_url: 'http://hijacker.testing.com',
      logger: { disabled: true },
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

    hijackerServer = new Hijacker(config)
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
    const source = CancelToken.source()

    socket.on('INTERCEPT', (data) => {
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
    const source = CancelToken.source()

    socket.on('INTERCEPT', (data) => {
      source.cancel()
      done()
    })

    axios.get('http://localhost:2000/posts', { cancelToken: source.token })
      .then(() => {
        expect(true).toBe(false)
      })
      .catch(() => {})
  })

  it('should allow modifying data in interceptRequest', (done) => {
    socket.on('INTERCEPT', (data) => {
      const newObj = data
      expect(typeof newObj).toBe('object')

      newObj.rule.body = {
        body: 'intercepted'
      }

      socket.emit(newObj.intercept.id, newObj)
    })

    axios.get('http://localhost:2000/cars')
      .then((response) => {
        expect(response.data).toEqual({
          body: 'intercepted'
        })
        done()
      })
  })

  it('should allow modifying data in interceptResponse', (done) => {
    socket.on('INTERCEPT', (data) => {
      const newObj = data
      expect(typeof newObj).toBe('object')

      newObj.response.body = {
        body: 'intercepted'
      }

      socket.emit(newObj.intercept.id, newObj)
    })

    axios.get('http://localhost:2000/posts')
      .then((response) => {
        expect(response.data).toEqual({
          body: 'intercepted'
        })
        done()
      })
  })

  it.todo('should only listen for one reponse from client per intercept')
})
