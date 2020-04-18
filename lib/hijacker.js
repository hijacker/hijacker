const http = require('http')
const path = require('path')

const bodyParser = require('body-parser')
const express = require('express')
const winston = require('winston')
const xmlParser = require('express-xml-bodyparser')

const config = require('./util/config')
const eventsMixin = require('./mixins/events')
const handlerMixin = require('./mixins/handler')
const socketsMixin = require('./mixins/sockets')
const rules = require('./util/rules')
const util = require('./util/util')

/**
 * Start hijacker instance based on configuration
 *
 * @type {Object} config - Hijacker configuration object
 */
class Hijacker {
  constructor (configObj) {
    // Set up server
    this.app = express()
    this.server = http.Server(this.app)
    this.conf = config.read(configObj)
    this.ruleList = configObj.rules.map(rules.read)
    this._logger = winston.createLogger({
      level: 'info',
      exitOnError: false,
      transports: [new winston.transports.Console()],
      format: winston.format.printf((info) => {
        return `${info.message}`
      }),
      ...this.conf.logger || {}
    })
    this._initEvents()

    // Express setup
    this.app
      .get('/favicon.ico', (req, res) => res.sendStatus(204))
      .use('/hijacker', express.static(path.join(__dirname, './frontend')))
      .use(bodyParser.json())
      .use(xmlParser())
      .use(util.requestCount())
      .all('*', (req, res) => this._handleRoute(req, res))

    // Start server
    this.server.listen(this.conf.port, () => {
      this._initSockets()
      this._emit('started', this.conf.port)
    })
  }

  close () {
    this.server.close()
  }
}

socketsMixin(Hijacker)
handlerMixin(Hijacker)
eventsMixin(Hijacker)

module.exports = Hijacker
