const express = require('express')
const bodyParser = require('body-parser')
const EventEmitter = require('events')
const path = require('path')
const http = require('http')
const axios = require('axios')
const https = require('https')
const socketio = require('socket.io')
const uuid = require('uuid/v4')

const config = require('./util/config')
const rules = require('./util/rules')
const util = require('./util/util')

/**
 * Start hijacker instance based on configuration
 *
 * @type {Object} config - Hijacker configuration object
 */
const hijacker = (configObj) => {
  const conf = config.read(configObj)

  // Set up server
  const app = express()
  const server = http.Server(app)
  const io = socketio(server)
  const events = new EventEmitter()

  const BASE_URL = conf.base_url

  const ruleList = configObj.rules.map(rules.read)

  /**
   * Main route handling function for HIjacker
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   *
   */
  const handleRoute = (req, res) => {
    const configAllow = (conf.globalRule.allow_headers || []).join(', ')

    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', configAllow)

    // API url to make the request to
    const REQUEST_URL = BASE_URL + req.originalUrl

    console.log(`[${req.requestNum}][PROXY][${req.method}] ${REQUEST_URL}`)

    // Set up original object to pass through promise chain
    const originalObj = {
      id: req.requestNum,
      rule: rules.match(ruleList, req),
      request: {
        headers: req.headers,
        method: req.method,
        body: req.body,
        hostName: req.hostName,
        originalUrl: req.originalUrl
      }
    }

    // Intercept (Request) => Request => Intercept (Response) => Return to client
    intercept(originalObj, 'request')
      .then((obj) => {
        // Generate headers to send to server
        const headers = {}
        const headersToKeep = obj.rule.keep_headers || conf.globalRule.keep_headers || []
        const nextObj = obj

        headersToKeep.forEach((header) => {
          if (Object.prototype.hasOwnProperty.call(obj.request.headers, header)) {
            headers[header] = obj.request.headers[header]
          }
        })

        nextObj.request.headers = headers

        return request(obj)
      })
      .then(obj => intercept(obj, 'response'))
      .then((obj) => sendResponse(obj.response, res))
      .catch(console.log)
  }

  /**
   * Send request to client to modify request/response
   *
   * @async
   * @function intercept
   * @param {Object} obj - Hijacker object that gets passed through promises
   * @param {string} type - Type of intercept. request or response
   * @returns {Promise<Object>} Hijacker object with data modified from socket return
   */
  const intercept = (obj, type) => (
    new Promise((resolve, reject) => {
      const nextObj = obj
      if (nextObj.rule[`intercept${type.charAt(0).toUpperCase() + type.slice(1)}`] && io.sockets.sockets.length !== 0) {
        let resolved = false

        nextObj.intercept = {
          id: uuid(),
          type
        }

        // Send event to clients
        io.emit('intercept', nextObj)
        console.log('Waiting on response from client')

        const clientResponse = (data) => {
          if (!resolved) {
            resolved = true
            resolve(data)
          }
        }

        Object.keys(io.sockets.sockets).forEach((socketId) => {
          const socket = io.sockets.sockets[socketId]

          socket.once(obj.intercept.id, clientResponse)
        })
      } else {
        resolve(nextObj)
      }
    })
  )

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
      const REQUEST_URL = BASE_URL + (nextObj.rule.routeTo || nextObj.request.originalUrl)

      // Axios options
      const options = {
        url: REQUEST_URL,
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
        axios(options).then((response) => {
          console.log(`[${obj.id}][${options.method}][${response.status}] ${REQUEST_URL}`)
          responseObj.headers = response.headers
          responseObj.body = nextObj.rule.body || response.data
          responseObj.method = options.method
          responseObj.statusCode = nextObj.rule.statusCode || response.status
          responseObj.contentType = response.headers['content-type']

          nextObj.response = responseObj
          console.log("RESPONSE", responseObj)
          resolve(nextObj)
        }).catch((err) => {
          const response = err.response
          console.log(`[${obj.id}][${options.method}][${response.status}] ${REQUEST_URL}`)
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

module.exports = hijacker
