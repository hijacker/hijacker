const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const request = require('request')
const io = require('socket.io')(server)


// Port to run api and web server on
const PORT = 3000

// Base url for api to proxy to.
const BASE_URL = 'https://jsonplaceholder.typicode.com'

// Default set of rules (to fall back on if non specified)
const DEFAULT_RULES = {
  interceptRequest  :  false, // Allow "breakpoint" on original request before sent to api
  interceptResponse :  false, // Allow "breakpoint" on response from api before sent to client
  skipApi           :  false  // Allow skipping going to the api all together
}

// Express setup
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Admin panel setup
app.use('/middleman', express.static('frontend'))

// Request count to use as IDs for request
let request_count = 0

// List of rules to activate on routes
let rules = []

const handleRoute = (req, res) => {
  // API url to make the request to
  const REQUEST_URL = BASE_URL + req.originalUrl
  const HEADERS_TO_KEEP = []

  console.log(`[${++request_count}][PROXY][${req.method}] ${REQUEST_URL}`)

  // Grab rule for given route make match regex in future
  let route_rule = rules.filter((el) => el.path === req.originalUrl)[0] || DEFAULT_RULES

  // Websocket here for request to proxy (before sent to api server)
  io.emit('proxy_request', {
    request_id: request_count,
    headers: req.headers,
    method: req.method,
    body: req.body,
    host: req.hostname,
    path: req.originalUrl,
    rule: route_rule
  })

  // Generate headers to keep
  let headers = {}
  for (let i = 0; i < HEADERS_TO_KEEP.length; i++) {
    if (req.headers.hasOwnProperty(HEADERS_TO_KEEP[i])) {
      headers[HEADERS_TO_KEEP[i]] = req.headers[HEADERS_TO_KEEP[i]]
    }
  }

  // Set options to relay to api server
  let options = {
    url: REQUEST_URL,
    method: req.method,
    headers: headers,
    body: req.body,
    json: true,
    strictSSL: false
  }

  if (!route_rule.skipApi) {
    request(options, (error, response, body) => {
      console.log(`[${request_count}][${options.method}][${response.statusCode}] ${REQUEST_URL}`)

      // Websocket here for response from api
      io.emit('api_response', {
        request_id: request_count,
        headers: response.headers,
        method: options.method,
        body: body,
        url: options.url,
        status: response.statusCode,
        apiSkipped: false
      })

      // Send response as close to api response as possible
      res.header('Content-Type', response.headers['content-type'])
      res.status(route_rule.statusCode || response.statusCode)
      res.json(route_rule.body || body || {})
    })
  } else {
    io.emit('api_response', {
      request_id: request_count,
      headers: res.headers,
      method: res.method,
      body: route_rule.body || {},
      url: options.url,
      status: route_rule.statusCode || 200,
      apiSkipped: true
    })

    res.header('Content-Type', 'application/json')
    res.status(route_rule.statusCode || 200)
    res.json(route_rule.body || {})
  }

}

// Prevent favicon requests
app.get('/favicon.ico', (req, res) => {
  res.status(204)
})

// Set routes for the proxy to lisetn too
app.get('*', handleRoute)
app.post('*', handleRoute)

// Send data needed for admin setup on setup
io.on('connection', (socket) => {
  socket.emit('settings', {
    rules: rules
  })
})

server.listen(PORT, () => {
  console.log(`Application is listening on port ${PORT}`)
})
