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
          skipApi: true,
          method: 'POST',
          body: {
            test: 'testing'
          }
        }
      ]
    }

    hijackerServer = hijacker(config)
    nockServer = nock('http://hijacker.testing.com')
  })

  afterAll(() => {
    hijackerServer.close()
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
})
