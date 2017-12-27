const socketio = require('socket.io')

const rules = require('../util/rules')

/**
 * Set up listening to sockets from client
 *
 * @function initSockets
 */
const socketsMixin = (Hijacker) => {
  Hijacker.prototype._initSockets = function() {
    let ruleList = this.app.get('ruleList')

    this.io = socketio(this.server)
    this.app.set('io', this.io)

    // Send data needed for admin setup on setup
    this.io.on('connection', (socket) => {
      socket.emit('settings', {
        rules: ruleList
      })

      // Update a rule
      socket.on('UPDATE_RULE', (rule) => {
        const index = ruleList.findIndex(r => r.id === rule.id)
        ruleList[index] = rules.read(rule, true)
        this.io.emit('UPDATE_RULE_LIST', ruleList)
      })

      socket.on('ADD_RULE', (rule) => {
        const newRule = rules.read(rule)
        ruleList.push(newRule)
        this.io.emit('UPDATE_RULE_LIST', ruleList)
      })
    })
  }
}

module.exports = socketsMixin
