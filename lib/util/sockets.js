const rules = require('./rules')

/**
 * Set up listening to sockets from client
 *
 * @function initSockets
 */
module.exports = (app) => {
  const io = app.get('io')
  const ruleList = app.get('ruleList')

  // Send data needed for admin setup on setup
  io.on('connection', (socket) => {
    socket.emit('settings', {
      rules: ruleList
    })

    // Update a rule
    socket.on('UPDATE_RULE', (rule) => {
      const index = ruleList.findIndex(r => r.id === rule.id)
      ruleList[index] = rule
    })

    socket.on('ADD_RULE', (rule) => {
      // TODO: Handle case if rule doesn't meet validation reqs
      ruleList.push(rules.read(rule))
    })
  })
}
