/* eslint-disable no-param-reassign, func-names */

const got = require('got')
const https = require('https')

const { logger } = require('../util/logger')
const intercept = require('../util/intercept')
const rules = require('../util/rules')
const util = require('../util/util')

/**
 * Main route handling function for Hijacker
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 *
 */
module.exports = (Hijacker) => {
  Hijacker.prototype._handleRoute = function (req, res) {
    const globalRule = {
      ...this.conf.globalRule
    }
    const configAllow = (globalRule.allow_headers || []).join(', ')
    const io = res.app.get('io')

    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', configAllow)

    // API url to make the request to
    const BASE_URL = this.conf.base_url

    logger.log('info', `[${req.requestNum}][PROXY][${req.method}] ${req.originalUrl}`)
    logger.log('http', { type: 0, ...req })

    // Set up original object to pass through promise chain
    const originalObj = {
      id: req.requestNum,
      reqTime: +new Date(),
      baseUrl: BASE_URL,
      rule: rules.match(this.ruleList, req),
      request: {
        headers: req.headers,
        method: req.method,
        body: req.rawBody || req.body,
        hostName: req.hostName,
        originalUrl: req.originalUrl
      }
    }

    io.emit('CLIENT_REQUEST', originalObj)

    // Intercept (Request) => Request => Intercept (Response) => Return to client
    intercept(originalObj, req, 'request')
      .then((obj) => {
        // Generate headers to send to server
        const headers = {}
        const headersToKeep = obj.rule.keep_headers || globalRule.keep_headers || []
        const nextObj = obj

        headersToKeep.forEach((header) => {
          if (Object.prototype.hasOwnProperty.call(obj.request.headers, header)) {
            headers[header] = obj.request.headers[header]
          }
        })

        nextObj.request.headers = headers

        return request(obj)
      })
      .then(obj => intercept(obj, req, 'response'))
      .then(obj => sendResponse(obj, res))
      .catch(e => sendResponse({
        ...originalObj,
        response: {
          headers: {},
          method: req.method,
          body: {
            message: 'There was an error processing your request',
            error: e
          },
          url: req.originalUrl,
          statusCode: 500,
          apiSkipped: false,
          contentType: 'application/json'
        }
      }, res))
  }
}

/**
 * Make request to api server if supposed to. And modify object
 *
 * @async
 * @function request
 * @param {Object} obj - Hijacker object that gets passed through promises
 * @returns {Promise<Object>} Hijacker object with data modified from request
 */
const request = obj => (
  new Promise((resolve, reject) => {
    const nextObj = obj
    const url = obj.baseUrl + (nextObj.rule.routeTo || nextObj.request.originalUrl)

    // got options
    const options = {
      method: nextObj.request.method,
      headers: nextObj.request.headers,
      throwHttpErrors: false,
      agent: {
        https: new https.Agent({
          rejectUnauthorized: false
        })
      },
      hooks: {
        beforeRequest: [
          // Log HTTP request right before it gets sent by got
          (req) => {
            logger.log('http', {
              type: 1,
              ...req
            })
          }
        ]
      }
    }

    if (options.method !== 'GET') {
      options.body = JSON.stringify(nextObj.request.body)
    }

    const responseObj = {
      url,
      method: nextObj.request.method,
      headers: nextObj.request.headers,
      body: nextObj.rule.body || {},
      statusCode: nextObj.rule.statusCode || 200,
      apiSkipped: !nextObj.rule.interceptResponse,
      contentType: 'application/json'
    }

    if (!nextObj.rule.skipApi) {
      got(url, options)
        .then((response) => {
          logger.log('info', `[${obj.id}][${options.method}][${response.statusCode}] ${url}`)

          responseObj.headers = response.headers
          responseObj.contentType = response.headers['content-type']
          responseObj.method = options.method
          responseObj.statusCode = nextObj.rule.statusCode || response.statusCode
          responseObj.body = nextObj.rule.body || response.body

          logger.log('http', { type: 2, ...responseObj })

          // FIXME: Temporary hack to allow set-cookie to work on non-secure
          // Also may need to strip domain from set-cookie as well
          if (Object.prototype.hasOwnProperty.call(responseObj.headers, 'set-cookie')) {
            responseObj.headers['set-cookie'] = responseObj.headers['set-cookie'][0]
              .split(';')
              .filter(x => x.indexOf('Secure') === -1)
              .join(';')
          }

          nextObj.response = responseObj

          resolve(nextObj)
        })
        .catch(reject)
    } else {
      nextObj.response = responseObj
      resolve(nextObj)
    }
  })
)

/**
 * Send response to client. End of the chain
 *
 * @async
 * @function sendResponse
 * @param {Object} responseObj - Hijacker object with response data to finish request
 * @param {Object} response.headers = Headers to send back in the response to the client
 * @param {Object} response.body - Response body to send back to the client
 * @param {number} response.statusCode - HTTP code to send back to the client
 * @param {Response} res - Express response object to finish off request
 */
const sendResponse = (responseObj, res) => {
  const io = res.app.get('io')

  // Websocket here for response that is being sent to client
  io.emit('CLIENT_RESPONSE', responseObj)

  logger.log('http', { type: 3, ...responseObj.response })

  res.set(util.filterResponseHeaders(responseObj.response.headers))
  res.status(responseObj.response.statusCode)
  res.send(responseObj.response.body)
}
