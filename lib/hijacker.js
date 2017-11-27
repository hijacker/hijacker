const EventEmitter = require('events')
const http = require('http')
const path = require('path')

const bodyParser = require('body-parser')
const express = require('express')
const socketio = require('socket.io')

const config = require('./util/config')
const handleRoute = require('./util/handler')
const initSockets = require('./util/sockets')
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

  // Express setup
  app.get('/favicon.ico', (req, res) => res.sendStatus(204))
  app.use('/hijacker', express.static(path.join(__dirname, './frontend')))
  app.use(bodyParser.json())
  app.use(util.requestCount())
  app.all('*', handleRoute)

  // Start server
  server.listen(conf.port, () => {
    initSockets(app)
    events.emit('started', conf.port)
  })

  return {
    on: (eventName, cb) => events.on(eventName, cb),
    once: (eventName, cb) => events.once(eventName, cb),
    close: () => server.close()
  }
}
