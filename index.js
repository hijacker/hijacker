const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const server = require('http').Server(app)

const config = require('./src/backend/util/config')
const hijacker = require('./src/backend/app')(server)

// Express setup
app.use(bodyParser.json())
app.use((req, res, next) => {
  let configAllow = (config.global.allow_headers || []).join(', ')

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', configAllow);
  next();
});

// Admin panel setup
app.use('/hijacker', express.static(path.join(__dirname, 'src/frontend')))

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
