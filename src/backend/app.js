const axios = require('axios')
const uuid = require('uuid/v4')

const config = require('./util/config')
const rules = require('./util/rules')

// Base url for api to proxy to.
const BASE_URL = config.base_url

const app = (server) => {
  const io = require('socket.io')(server)

  // Request count to use as IDs for request
  let request_count = 0

  // List of rules to activate on routes
  let ruleList = rules.read(config.rules)

  const handleRoute = (req, res) => {
    // API url to make the request to
    const REQUEST_URL = BASE_URL + req.originalUrl

    console.log(`[${++request_count}][PROXY][${req.method}] ${REQUEST_URL}`)

    // Grab rule for given route make match regex in future
    let route_rule = rules.match(ruleList, req)

    // Generate unique IDs for request and responsef
    let request_id = uuid()
    let response_id = uuid()

    // Websocket here for request to proxy (before sent to api server)
    io.emit('proxy_request', {
      request_id: request_count,
      headers: req.headers,
      method: req.method,
      body: req.body,
      host: req.hostname,
      path: req.originalUrl,
      rule: route_rule,
      intercepted_id: route_rule.interceptRequest ? request_id : false
    })

    // Generate headers to send to server
    let headers = {}
    let headers_to_keep = route_rule.keep_headers || []

    for (let i = 0; i < headers_to_keep.length; i++) {
      if (req.headers.hasOwnProperty(headers_to_keep[i])) {
        headers[headers_to_keep[i]] = req.headers[headers_to_keep[i]]
      }
    }

    // Set options to relay to api server
    let options = {
      url: REQUEST_URL,
      method: req.method,
      headers: headers,
      data: req.body,
      strictSSL: false
    }

    // interceptRequest if the route rule says to
    if (route_rule.interceptRequest && io.sockets.sockets.length !== 0) {
      console.log("Waiting for response from admin")
      let resolved = false

      for (let id in io.sockets.sockets) {
        let socket = io.sockets.sockets[id]

        socket.once(request_id, (data) => {
          if (!resolved) {
            resolved = true
            options.body = data.body || options.body
            options.method = data.method || options.method
          }
        })
      }
    }

    let responseObj = {
      request_id: request_count,
      headers: res.headers,
      method: res.method,
      body: route_rule.body || {},
      url: options.url,
      statusCode: route_rule.statusCode || 200,
      apiSkipped: !route_rule.interceptResponse,
      intercepted_id: route_rule.interceptResponse ? response_id : false,
      rule: route_rule,
      contentType: 'application/json'
    }

    if (!route_rule.skipApi) {
      axios(options).then(response => {
        console.log(`[${request_count}][${options.method}][${response.status}] ${REQUEST_URL}`)
        responseObj.headers = response.headers
        responseObj.body = route_rule.body || response.data
        responseObj.method = options.method
        responseObj.statusCode = route_rule.statusCode || response.status
        responseObj.contentType = response.headers['content-type']

        sendResponse(responseObj, res)
      }).catch(err => {
        let response = err.response
        console.log(`[${request_count}][${options.method}][${response.status}] ${REQUEST_URL}`)
        responseObj.headers = response.headers
        responseObj.body = route_rule.body || response.data
        responseObj.method = options.method
        responseObj.statusCode = route_rule.statusCode || response.status
        responseObj.contentType = response.headers['content-type']

        sendResponse(responseObj, res)
      })
    } else {
      // Websocket here for response from api
      sendResponse(responseObj, res)
    }

  }

  const sendResponse = (responseObj, res) => {
    // Websocket here for response from api
    io.emit('api_response', responseObj)

    // Send response as close to api response as possible
    res.header('Content-Type', responseObj.contentType)
    res.status(responseObj.statusCode)

    // Listen for response from admin if breakpoint on
    if (responseObj.rule.interceptResponse && io.sockets.sockets.length !== 0) {
      console.log("Waiting for response from admin")
      let resolved = false

      for (let id in io.sockets.sockets) {
        let socket = io.sockets.sockets[id]

        socket.once(responseObj.response_id, (data) => {
          if (!resolved) {
            resolved = true
            res.status(data.statusCode || 200)
            res.json(data.body || {})
          }
        })
      }
    } else {
      // Just send back responses
      res.json(responseObj.body)
    }
  }

  const initSockets = () => {
    // Send data needed for admin setup on setup
    io.on('connection', (socket) => {
      socket.emit('settings', {
        rules: ruleList
      })

      socket.on('UPDATE_RULE', (rule) => {
        const index = ruleList.findIndex(r => r.id === rule.id)
        ruleList[index] = rule
      })
    })
  }

  return {
    handleRoute: handleRoute,
    initSockets: initSockets
  }
}

module.exports = app
