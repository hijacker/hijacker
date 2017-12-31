const uuid = require('uuid/v4')

/**
 * Send request to client to modify request/response
 *
 * @async
 * @function intercept
 * @param {Object} obj - Hijacker object that gets passed through promises
 * @param {Object} req - Express request object
 * @param {string} type - Type of intercept. request or response
 * @returns {Promise<Object>} Hijacker object with data modified from socket return
 */
module.exports = (obj, req, type) => (
  new Promise((resolve, reject) => {
    const nextObj = obj
    const io = req.app.get('io')

    if (nextObj.rule[`intercept${type.charAt(0).toUpperCase() + type.slice(1)}`] && io.sockets.sockets.length !== 0) {
      let resolved = false

      nextObj.intercept = {
        id: uuid(),
        type
      }

      // Send event to clients
      io.emit('intercept', nextObj)

      const clientResponse = (data) => {
        if (!resolved) {
          resolved = true
          resolve(data)
        }
      }

      Object.keys(io.sockets.sockets).forEach((socketId) => {
        const socket = io.sockets.sockets[socketId]

        socket.once(obj.intercept.id, clientResponse)
      })
    } else {
      resolve(nextObj)
    }
  })
)
