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

module.exports = {
  requestCount
}
