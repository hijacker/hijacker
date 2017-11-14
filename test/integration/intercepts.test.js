/* eslint-env jest */

const axios = require('axios')
const io = require('socket.io-client')
const hijacker = require('../..')

describe('Integration Tests', () => {
  let hijackerServer
  let socket

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
    socket.on('intercept', (data) => {
      socket.emit(data.intercept.id, data)
    })

    axios.get('http://localhost:2000/cars')
      .then((response) => {
        done()
      })
  })

  it('should send a socket event on interceptResponse and continue on emit', (done) => {
    socket.on('intercept', (data) => {
      socket.emit(data.intercept.id, data)
    })

    axios.get('http://localhost:2000/posts')
      .then((response) => {
        done()
      })
  })

  it('should allow modifying data in interceptRequest')

  it('should allow modifying data in interceptResponse')

  it('should only listen for one reponse from client per intercept')
})
