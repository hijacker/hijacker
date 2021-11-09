/* eslint-env jest */

const axios = require('axios')
const nock = require('nock')

const Hijacker = require('../..')

describe('Request Tests', () => {
  let hijackerServer
  let nockServer

  beforeAll(() => {
    const config = {
      base_url: 'http://hijacker.testing.com',
      logger: { silent: true },
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

    hijackerServer = new Hijacker(config)
    nockServer = nock('http://hijacker.testing.com')
  })

  afterAll(() => {
    hijackerServer.close()
  })

  afterEach(() => {
    // Cleear all intercepts incase a test fails
    nock.cleanAll()
  })

  it('should return 204 for favicon', (done) => {
    axios.get('http://localhost:3000/favicon.ico')
      .then((response) => {
        expect(response.status).toBe(204)

        done()
      })
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

  it('should make sure body is sent correctly', (done) => {
    // Only reply if body matches
    nockServer.post('/cars', { color: 'red' })
      .reply(200, {
        id: 1,
        make: 'Ford',
        model: 'Mustang'
      })

    axios.post('http://localhost:3000/cars', { color: 'red' })
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

  it('should forward error from server correctly', (done) => {
    nockServer.put('/error')
      .reply(404, {
        error: 'Not Found'
      })

    axios.put('http://localhost:3000/error')
      .catch((err) => {
        expect(err.response.status).toBe(404)
        expect(err.response.data).toEqual({
          error: 'Not Found'
        })

        done()
      })
  })

  it.todo('should remove all hopbyhop headers before returning response to client')
  it.todo('should forward rest of headers from api')
})
