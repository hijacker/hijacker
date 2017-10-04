const axios = require('axios')
const https = require('https')
const socketio = require('socket.io')
const uuid = require('uuid/v4')

const config = require('./util/config').config
const rules = require('./util/rules')

// Base url for api to proxy to.
const BASE_URL = config.base_url

const app = (server) => {
  const io = socketio(server)

  // List of rules to activate on routes
  const ruleList = config.rules.map(rules.read)

  // Request count to use as IDs for request
  let requestCount = 0

  /**
   * Main route handling function for HIjacker
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   *
   */
  const handleRoute = (req, res) => {
    // API url to make the request to
    const REQUEST_URL = BASE_URL + req.originalUrl

    requestCount += 1

    console.log(`[${requestCount}][PROXY][${req.method}] ${REQUEST_URL}`)

    // Set up original object to pass through promise chain
    const originalObj = {
      id: requestCount,
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
        const headersToKeep = obj.rule.keep_headers || config.global.keep_headers || []
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
      .then((obj) => {
        // return shit here
        sendResponse(obj.response, res)
      })
      .catch((err) => {
        console.log(err)
      })
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
          console.log(`[${requestCount}][${options.method}][${response.status}] ${REQUEST_URL}`)
          responseObj.headers = response.headers
          responseObj.body = nextObj.rule.body || response.data
          responseObj.method = options.method
          responseObj.statusCode = nextObj.rule.statusCode || response.status
          responseObj.contentType = response.headers['content-type']

          nextObj.response = responseObj
          resolve(nextObj)
        }).catch((err) => {
          const response = err.response
          console.log(`[${requestCount}][${options.method}][${response.status}] ${REQUEST_URL}`)
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

  return {
    handleRoute,
    initSockets
  }
}

module.exports = app