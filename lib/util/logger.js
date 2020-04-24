const { createLogger, transports, format } = require('winston')

const DEFAULT_OPTIONS = {
  level: 'info',
  exitOnError: false,
  transports: [new transports.Console()],
  format: format.printf((info) => {
    /**
     * HTTP log should contain:
     * - type: Type of http request
     *      0 - Request to Hijacker
     *      1 - Request to API
     *      2 - Response from API
     *      3 - Response from Hijacker
     * - url: Url of request/response
     * - method: HTTP Method
     * - headers: Object of headers for request/response
     * - body: Response/Request body
     *
     */
    if (info.level === 'http') {
      const type = [
        'Request to Hijacker',
        'Request to API',
        'Response from API',
        'Response from Hijacker'
      ][info.message.type]

      return `${'-'.repeat(type.length)}\n` +
             `${type}\n` +
             `${'-'.repeat(type.length)}\n` +
             `Path: ${info.message.url}\n` +
             `Method: ${info.message.method}\n` +
             `Headers:\n` +
             `${JSON.stringify(info.message.headers, null, 2)}\n` +
             `Body:\n` +
             `${JSON.stringify(info.message.body, null, 2)}`
    }

    return `${info.message}`
  })
}

let winstonLogger = null

const initLogger = (options = {}) => {
  winstonLogger = createLogger({
    ...DEFAULT_OPTIONS,
    ...options
  })
}

const logger = {
  log: (level, message) => winstonLogger.log({
    level,
    message
  })
}

module.exports = {
  initLogger,
  logger
}
