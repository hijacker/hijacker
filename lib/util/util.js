/**
 * Express middleware to add a request number to each request object
 *
 * @return {Function} Function that can be used as middleware in express
 */
const requestCount = () => {
  let count = 0

  return (req, res, next) => {
    count += 1
    req.requestNum = count
    next()
  }
}

/**
 * Clean up headers that should not be in proxied requests
 *
 * @function filterResponseHeaders
 * @param {Object} headers - Headers to strip before sending back to client
 * @return  {Object} Headers without headers that need to be removed
 */
const filterResponseHeaders = (headers) => {
  const headerKeys = Object.keys(headers)
  const connectionHeaders = (headers['connection'] || '').split(',').map(x => x.trim())
  const hopbyhop = [
    'te',
    'transfer-encoding',
    'connection',
    'content-encoding',
    'keep-alive',
    'proxy-authorization',
    'proxy-authentication',
    'trailer',
    'upgrade',
    ...connectionHeaders
  ]

  // Filter out hop by hop headers
  let acceptedHeaders = headerKeys.filter(x => hopbyhop.indexOf(x) === -1)

  // Add keys and values to new object now that we have filtered keys that belong
  let filtered = {}

  for (let i = 0; i < acceptedHeaders.length; i++) {
    filtered[acceptedHeaders[i]] = headers[acceptedHeaders[i]]
  }

  return filtered;
}

const headersToJson = (headers) => {
  return Array.from(headers.keys()).reduce((result, key) => {
    let val = headers.get(key)

    if (val) {
      result[key] = val
    }

    return result
  }, {})
}

module.exports = {
  requestCount,
  filterResponseHeaders,
  headersToJson
}
