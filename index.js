const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const server = require('http').Server(app)

const config = require('./src/backend/util/config')
const middleman = require('./src/backend/app')(server)

// Express setup
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Admin panel setup
app.use('/middleman', express.static(path.join(__dirname, 'src/frontend')))

// Prevent favicon requests
app.get('/favicon.ico', (req, res) => {
  res.status(204)
})

// Set routes for the proxy to lisetn too
app.get('*', middleman.handleRoute)
app.post('*', middleman.handleRoute)

middleman.initSockets()

server.listen(config.port, () => {
  console.log(`Application is listening on port ${config.port}`)
})
