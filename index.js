const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const http = require('http')

const config = require('./lib/backend/util/config').config
const backend = require('./lib/backend/app')

const app = express()
const server = http.Server(app)
const hijacker = backend(server)

// Express setup
app.use(bodyParser.json())
app.use((req, res, next) => {
  const configAllow = (config.global.allow_headers || []).join(', ')

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', configAllow)
  next()
})

// Admin panel setup
app.use('/hijacker', express.static(path.join(__dirname, 'lib/frontend')))

// Prevent favicon requests
app.get('/favicon.ico', (req, res) => {
  res.status(204)
})

// Set routes for the proxy to lisetn too
app.delete('*', hijacker.handleRoute)
app.get('*', hijacker.handleRoute)
app.patch('*', hijacker.handleRoute)
app.post('*', hijacker.handleRoute)
app.put('*', hijacker.handleRoute)

hijacker.initSockets()

server.listen(config.port, () => {
  console.log(`Application is listening on port ${config.port}`)
})
