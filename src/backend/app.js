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

    let originalObj = {
      id: request_count,
      rule: route_rule,
      request: {
        headers: req.headers,
        method: req.method,
        body: req.body,
        hostName: req.hostName,
        originalUrl: req.originalUrl
      }
    }

    intercept(originalObj, 'request', io)
      .then(obj => {
        // Generate headers to send to server
        let headers = {}
        let headers_to_keep = obj.rule.keep_headers || config.global.keep_headers || []

        for (let i = 0; i < headers_to_keep.length; i++) {
          if (obj.request.headers.hasOwnProperty(headers_to_keep[i])) {
            headers[headers_to_keep[i]] = obj.request.headers[headers_to_keep[i]]
          }
        }

        obj.request.headers = headers
        
        return request(obj)
      })
      .then(obj => {
        return intercept(obj, 'response', io)
      })
      .then(obj => {
        // return shit here
        sendResponse(obj.response, res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const intercept = (obj, type, io) => {
    return new Promise((resolve, reject) => {
      if (obj.rule[`intercept${type.charAt(0).toUpperCase() + type.slice(1)}`] && io.sockets.sockets.length !== 0) {
        let resolved = false
        let newObj = obj

        newObj.interceptId = uuid()

        // Send event to clients
        io.emit(`intercept_${type}`, newObj)
        console.log('Waiting on response from client')

        for (let id in io.sockets.sockets) {
          let socket = io.sockets.sockets[id]

          socket.once(newObj.interceptId, (data) => {
            if (!resolved) {
              resolved = true
              resolve(data)
            }
          })
        }
      } else {
        resolve(obj)
      }
    })
  }

  const request = (obj) => {
    return new Promise((resolve, reject) => {
      const REQUEST_URL = BASE_URL + obj.request.originalUrl

      let newObj = obj

      // Set options to relay to api server
      let options = {
        url: REQUEST_URL,
        method: obj.request.method,
        headers: obj.request.headers,
        data: obj.request.body,
        strictSSL: false
      }

      let responseObj = {
        headers: obj.request.headers,
        method: obj.request.method,
        body: obj.rule.body || {},
        url: options.url,
        statusCode: obj.rule.statusCode || 200,
        apiSkipped: !obj.rule.interceptResponse,
        contentType: 'application/json'
      }

      if (!obj.rule.skipApi) {
        axios(options).then(response => {
          console.log(`[${request_count}][${options.method}][${response.status}] ${REQUEST_URL}`)
          responseObj.headers = response.headers
          responseObj.body = obj.rule.body || response.data
          responseObj.method = options.method
          responseObj.statusCode = obj.rule.statusCode || response.status
          responseObj.contentType = response.headers['content-type']

          newObj.response = responseObj
          resolve(newObj)
        }).catch(err => {
          let response = err.response
          console.log(`[${request_count}][${options.method}][${response.status}] ${REQUEST_URL}`)
          responseObj.headers = response.headers
          responseObj.body = obj.rule.body || response.data
          responseObj.method = options.method
          responseObj.statusCode = obj.rule.statusCode || response.status
          responseObj.contentType = response.headers['content-type']

          newObj.response = responseObj
          resolve(newObj)
        })
      } else {
        newObj.response = responseObj
        resolve(newObj)
      }
    })
  }

  const sendResponse = (responseObj, res) => {
    // Websocket here for response from api
    io.emit('api_response', responseObj)

    // Send response as close to api response as possible
    res.header('Content-Type', responseObj.contentType)
    res.status(responseObj.statusCode)
    res.json(responseObj.body)
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
