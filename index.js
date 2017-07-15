const path = require('path')

const express = require('express')
const app = express()
const server = require('http').Server(app)
const bodyParser = require('body-parser')
const request = require('request')
const io = require('socket.io')(server)

// Port to run api and web server on
const PORT = 3000

// Base url for api to proxy to.
const BASE_URL = 'https://jsonplaceholder.typicode.com'

// Express setup
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Admin panel setup
app.use('/middleman', express.static('frontend'))

const handleRoute = (req, res) => {
  // API url to make the request to
  const REQUEST_URL = BASE_URL + req.originalUrl
  const HEADERS_TO_KEEP = []

  console.log(`[PROXY][${req.method}] ${REQUEST_URL}`)

  // Websocket here for request to proxy (before sent to api server)
  io.emit('proxy_request', {
    headers: req.headers,
    method: req.method,
    body: req.body,
    host: req.hostname,
    path: req.originalUrl
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

  request(options, (error, response, body) => {
    console.log(`[${options.method}][${response.statusCode}] ${REQUEST_URL}`)

    // Websocket here for response from api
    io.emit('api_response', {
      headers: response.headers,
      method: options.method,
      body: body,
      url: options.url,
      status: response.statusCode
    })

    // Send response as close to api response as possible
    res.header('Content-Type', response.headers['content-type'])
    res.status(response.statusCode)
    res.json(body)
  })
}

// Prevent favicon requests
app.get('/favicon.ico', (req, res) => {
  res.status(204)
})

// Set routes for the proxy to lisetn too
app.get('*', handleRoute)
app.post('*', handleRoute)

io.on('connection', function(socket) {
  // Send current routes being messed with here
})

server.listen(PORT, () => {
  console.log(`Application is listening on port ${PORT}`)
})
