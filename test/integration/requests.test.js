/* eslint-env jest */

const nock = require('nock')
const axios = require('axios')

const hijacker = require('../..')

describe('Integration Tests', () => {
  let hijackerServer
  let nockServer

  beforeAll(() => {
    const config = {
      base_url: 'http://hijacker.testing.com',
      port: 3000,
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
    nockServer = nock('http://hijacker.testing.com')
  })

  afterAll(() => {
    hijackerServer.close()
  })

  afterEach(() => {
    // Cleear all intercepts incase a test fails
    nock.cleanAll()
  })

  it('should return api result if no matching rule', (done) => {
    nockServer.get('/cars')
      .reply(200, {
        id: 1,
        make: 'Ford',
        model: 'Mustang'
      })

    axios.get('http://localhost:3000/cars')
      .then((response) => {
        expect(response.data).toEqual({
          id: 1,
          make: 'Ford',
          model: 'Mustang'
        })

        done()
      })
  })

  it('should return rule body if matching rule', (done) => {
    nockServer.post('/cars')
      .reply(200, {
        id: 1,
        make: 'Ford',
        model: 'Mustang'
      })

    axios.post('http://localhost:3000/cars')
      .then((response) => {
        expect(response.data).toEqual({
          test: 'testing'
        })

        done()
      })
  })

  it('should not hit api if skipApi enabled', (done) => {
    const nockReq = nockServer.get('/posts')
      .reply(200, {
        id: 1,
        make: 'Ford',
        model: 'Mustang'
      })

    axios.get('http://localhost:3000/posts')
      .then((response) => {
        expect(response.data).toEqual({
          posts: 'get'
        })

        // nock intercept should be active b/c api skiped
        expect(nockReq.isDone()).toBe(false)

        done()
      })
  })

  it('should set the status code if specified in rule', (done) => {
    nockServer.put('/cars')
      .reply(200, {
        id: 1,
        make: 'Ford',
        model: 'Mustang'
      })

    axios.put('http://localhost:3000/cars')
      .catch((err) => {
        expect(err.response.status).toBe(418)
        done()
      })
  })
})
