const EventEmitter = require('events')
const http = require('http')
const path = require('path')

const bodyParser = require('body-parser')
const express = require('express')
const socketio = require('socket.io')

const config = require('./util/config')
const handleRoute = require('./util/handler')
const Sockets = require('./util/sockets')
const rules = require('./util/rules')
const util = require('./util/util')

/**
 * Start hijacker instance based on configuration
 *
 * @type {Object} config - Hijacker configuration object
 */
class Hijacker {
  constructor(configObj) {
    // Set up server
    this.app = express()
    this.server = http.Server(this.app)
    this.events = new EventEmitter()
    this.conf = config.read(configObj)

    // Set application variables
    this.app.set('io', socketio(this.server))
    this.app.set('ruleList', configObj.rules.map(rules.read))
    this.app.set('conf', this.conf)

    // Express setup
    this.app.get('/favicon.ico', (req, res) => res.sendStatus(204))
    this.app.use('/hijacker', express.static(path.join(__dirname, './frontend')))
    this.app.use(bodyParser.json())
    this.app.use(util.requestCount())
    this.app.all('*', handleRoute)

    // Start server
    this.server.listen(this.conf.port, () => {
      this.sockets = new Sockets(this.app)
      this.events.emit('started', this.conf.port)
    })
  }

  on(eventName, cb) {
    this.events.on(eventName, cb)
  }

  once(eventName, cb) {
    this.events.once(eventName, cb)
  }

  close() {
    this.server.close()
  }
}

module.exports = Hijacker
