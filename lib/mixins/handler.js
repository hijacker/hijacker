const fetch = require('node-fetch')
const https = require('https')

const intercept = require('../util/intercept')
const rules = require('../util/rules')
const util = require('../util/util')

/**
 * Main route handling function for HIjacker
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 *
 */
module.exports = (Hijacker) => {
  Hijacker.prototype._handleRoute = function(req, res) {
    const globalRule = this.conf.globalRule
    const configAllow = (globalRule.allow_headers || []).join(', ')
    const logger = this._logger

    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', configAllow)

    // API url to make the request to
    const BASE_URL = this.conf.base_url

    logger.log(`[${req.requestNum}][PROXY][${req.method}] ${req.originalUrl}`)

    // Set up original object to pass through promise chain
    const originalObj = {
      id: req.requestNum,
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
      .then((obj) => sendResponse(obj.response, res))
      .catch((e) => logger.log(e))
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

    // Fetch options
    const options = {
      method: nextObj.request.method,
      headers: nextObj.request.headers,
      agent: new https.Agent({
        rejectUnauthorized: false
      })
    }

    if (options.method !== 'GET') {
      options.body = nextObj.request.body
    }

    const responseObj = {
      headers: nextObj.request.headers,
      method: nextObj.request.method,
      body: nextObj.rule.body || {},
      url: options.url,
      statusCode: nextObj.rule.statusCode || 200,
      apiSkipped: !nextObj.rule.interceptResponse,
      contentType: 'application/json'
    }

    if (!nextObj.rule.skipApi) {
      fetch(url, options)
        .then((response) => {
          responseObj.headers = response.headers
          responseObj.contentType = response.headers.get('content-type')
          responseObj.method = options.method
          responseObj.statusCode = nextObj.rule.statusCode || response.status

          if (responseObj.contentType && responseObj.contentType.includes("application/json")) {
            return response.json()
          }

          return response.text()
        })
        .then((response) => {
          responseObj.body = nextObj.rule.body || response

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

  // Websocket here for response from api
  io.emit('api_response', responseObj)

  res.set(util.filterResponseHeaders(responseObj.headers))
  res.status(responseObj.statusCode)
  res.send(responseObj.body)
}
