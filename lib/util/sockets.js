const rules = require('./rules')

/**
 * Set up listening to sockets from client
 *
 * @function initSockets
 */
class Sockets {
  constructor(app) {
    this.io = app.get('io')
    this.ruleList = app.get('ruleList')

    // Send data needed for admin setup on setup
    this.io.on('connection', (socket) => {
      socket.emit('settings', {
        rules: this.ruleList
      })

      // Update a rule
      socket.on('UPDATE_RULE', (rule) => {
        const index = this.ruleList.findIndex(r => r.id === rule.id)
        this.ruleList[index] = rules.read(rule, true)
        this.io.emit('UPDATE_RULE_LIST', this.ruleList)
      })

      socket.on('ADD_RULE', (rule) => {
        const newRule = rules.read(rule)
        this.ruleList.push(newRule)
        this.io.emit('UPDATE_RULE_LIST', this.ruleList)
      })
    })
  }
}

module.exports = Sockets
