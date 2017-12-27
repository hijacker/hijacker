const http = require('http')
const path = require('path')

const bodyParser = require('body-parser')
const express = require('express')

const config = require('./util/config')
const eventsMixin = require('./util/events')
const handlerMixin = require('./util/handler')
const socketsMixin = require('./util/sockets')
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
    this.conf = config.read(configObj)
    this._initEvents()

    // Set application variables
    this.app.set('ruleList', configObj.rules.map(rules.read))
    this.app.set('conf', this.conf)

    // Express setup
    this.app.get('/favicon.ico', (req, res) => res.sendStatus(204))
    this.app.use('/hijacker', express.static(path.join(__dirname, './frontend')))
    this.app.use(bodyParser.json())
    this.app.use(util.requestCount())
    this.app.all('*', this._handleRoute)

    // Start server
    this.server.listen(this.conf.port, () => {
      this._initSockets()
      this._emit('started', this.conf.port)
    })
  }

  close() {
    this.server.close()
  }
}

socketsMixin(Hijacker)
handlerMixin(Hijacker)
eventsMixin(Hijacker)

module.exports = Hijacker
