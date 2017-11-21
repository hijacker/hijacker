const EventEmitter = require('events')
const http = require('http')
const https = require('https')
const path = require('path')

const axios = require('axios')
const bodyParser = require('body-parser')
const express = require('express')
const socketio = require('socket.io')

const config = require('./util/config')
const intercept = require('./util/intercept')
const rules = require('./util/rules')
const util = require('./util/util')

/**
 * Start hijacker instance based on configuration
 *
 * @type {Object} config - Hijacker configuration object
 */
module.exports = (configObj) => {
  // Set up server
  const app = express()
  const server = http.Server(app)
  const events = new EventEmitter()
  const conf = config.read(configObj)

  // Set application variables
  app.set('io', socketio(server))
  app.set('ruleList', configObj.rules.map(rules.read))
  app.set('conf', conf)

  /**
   * Main route handling function for HIjacker
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   *
   */
  const handleRoute = (req, res) => {
    const globalRule = req.app.get('conf').globalRule
    const configAllow = (globalRule.allow_headers || []).join(', ')

    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', configAllow)

    // API url to make the request to
    const BASE_URL = req.app.get('conf').base_url

    console.log(`[${req.requestNum}][PROXY][${req.method}] ${req.originalUrl}`)

    // Set up original object to pass through promise chain
    const originalObj = {
      id: req.requestNum,
      baseUrl: BASE_URL,
      rule: rules.match(req.app.get('ruleList'), req),
      request: {
        headers: req.headers,
        method: req.method,
        body: req.body,
        hostName: req.hostName,
        originalUrl: req.originalUrl
      }
    }

    // Intercept (Request) => Request => Intercept (Response) => Return to client
    intercept(originalObj, req, 'request')
      .then((obj) => {
        // Generate headers to send to server
        const headers = {}
        const headersToKeep = obj.rule.keep_headers || globalRule.keep_headers || []
        const nextObj = obj

        headersToKeep.forEach((header) => {
          if (Object.prototype.hasOwnProperty.call(obj.request.headers, header)) {
            headers[header] = obj.request.headers[header]
          }
        })

        nextObj.request.headers = headers

        return request(obj)
      })
      .then(obj => intercept(obj, req, 'response'))
      .then((obj) => sendResponse(obj.response, res))
      .catch(console.log)
  }

  /**
   * Make request to api server if supposed to. And modify object
   *
   * @async
   * @function request
   * @param {Object} obj - Hijacker object that gets passed through promises
   * @returns {Promise<Object>} Hijacker object with data modified from request
   */
  const request = obj => (
    new Promise((resolve, reject) => {
      const nextObj = obj

      // Axios options
      const options = {
        url: obj.baseUrl + (nextObj.rule.routeTo || nextObj.request.originalUrl),
        method: nextObj.request.method,
        headers: nextObj.request.headers,
        data: nextObj.request.body,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      }

      const responseObj = {
        headers: nextObj.request.headers,
        method: nextObj.request.method,
        body: nextObj.rule.body || {},
        url: options.url,
        statusCode: nextObj.rule.statusCode || 200,
        apiSkipped: !nextObj.rule.interceptResponse,
        contentType: 'application/json'
      }

      if (!nextObj.rule.skipApi) {
        axios(options)
          .then((response) => Promise.resolve(response),
            (err) => Promise.resolve(err.response))
          .then((response) => {
            console.log(`[${obj.id}][${options.method}][${response.status}] ${options.url}`)
            responseObj.headers = response.headers
            responseObj.body = nextObj.rule.body || response.data
            responseObj.method = options.method
            responseObj.statusCode = nextObj.rule.statusCode || response.status
            responseObj.contentType = response.headers['content-type']

            nextObj.response = responseObj
            resolve(nextObj)
          })
      } else {
        nextObj.response = responseObj
        resolve(nextObj)
      }
    })
  )

  /**
   * Send response to client. End of the chain
   *
   * @async
   * @function sendResponse
   * @param {Object} responseObj - Hijacker object with response data to finish request
   * @param {Object} response.headers = Headers to send back in the response to the client
   * @param {Object} response.body - Response body to send back to the client
   * @param {number} response.statusCode - HTTP code to send back to the client
   * @param {Response} res - Express response object to finish off request
   */
  const sendResponse = (responseObj, res) => {
    const io = app.get('io')

    // Websocket here for response from api
    io.emit('api_response', responseObj)

    // Send response as close to api response as possible
    res.set(responseObj.headers)
    res.status(responseObj.statusCode)
    res.json(responseObj.body)
  }

  /**
   * Set up listening to sockets from client
   *
   * @function initSockets
   */
  const initSockets = () => {
    const io = app.get('io')
    const ruleList = app.get('ruleList')

    // Send data needed for admin setup on setup
    io.on('connection', (socket) => {
      socket.emit('settings', {
        rules: ruleList
      })

      // Update a rule
      socket.on('UPDATE_RULE', (rule) => {
        const index = ruleList.findIndex(r => r.id === rule.id)
        ruleList[index] = rule
      })

      socket.on('ADD_RULE', (rule) => {
        // TODO: Handle case if rule doesn't meet validation reqs
        ruleList.push(rules.read(rule))
      })
    })
  }

  // Express setup
  app.get('/favicon.ico', (req, res) => res.sendStatus(204))
  app.use('/hijacker', express.static(path.join(__dirname, './frontend')))
  app.use(bodyParser.json())
  app.use(util.requestCount())
  app.all('*', handleRoute)

  // Start server
  server.listen(conf.port, () => {
    initSockets()
    events.emit('started', conf.port)
  })

  return {
    on: (eventName, cb) => events.on(eventName, cb),
    once: (eventName, cb) => events.once(eventName, cb),
    close: () => server.close()
  }
}
