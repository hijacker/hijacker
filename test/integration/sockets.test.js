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
      port: 4000,
      rules: [
        {
          path: '/cars',
          skipApi: true,
          method: 'GET',
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

  it('should add a new rule when ADD_RULE event sent', (done) => {
    axios.get('http://localhost:4000/error')
      .catch(() => {
        expect(true).toBe(true)
      })
      .then(() => {
        socket.emit('ADD_RULE', {
          path: '/error',
          skipApi: true,
          method: 'GET',
          statusCode: 200,
          body: {
            error: 'works'
          }
        })

        return axios.get('http://localhost:4000/error')
      })
      .then((response) => {
        expect(response.data).toEqual({
          error: 'works'
        })

        done()
      })
  })

  it('should update a new rule when UPDATE_RULE event sent', (done) => {
    let ruleList

    socket.on('settings', (data) => {
      ruleList = data.rules

      axios.get('http://localhost:4000/cars')
        .then((response) => {
          expect(response.data).toEqual({
            test: 'testing'
          })

          ruleList[0].body = {
            new: 'body'
          }

          socket.emit('UPDATE_RULE', ruleList[0])

          return axios.get('http://localhost:4000/cars')
        })
        .then((response) => {
          expect(response.data).toEqual({
            new: 'body'
          })

          done()
        })
    })
  })

  it('should send updated rule list on ADD_RULE', (done) => {
    let ruleList

    socket.on('UPDATE_RULE_LIST', (data) => {
      expect(data.length).toBe(ruleList.length + 1)
      done()
    })

    socket.on('settings', (data) => {
      ruleList = data.rules

      socket.emit('ADD_RULE', {
        path: '/error',
        skipApi: true,
        method: 'GET',
        statusCode: 200
      })
    })
  })

  it('should send updated rule list on UPDATE_RULE', (done) => {
    let ruleList

    socket.on('UPDATE_RULE_LIST', (data) => {
      expect(data[0].body).toEqual({
        updated: 'rule'
      })
      done()
    })

    socket.on('settings', (data) => {
      ruleList = data.rules

      const newRule = Object.assign({}, ruleList[0], {
        body: {
          updated: 'rule'
        }
      })

      socket.emit('UPDATE_RULE', newRule)
    })
  })
})
