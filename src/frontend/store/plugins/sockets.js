import * as types from '../types'

export default function(socket) {
  return store => {
    // Events from sockets
    socket.on('settings', function(data) {
      store.commit('SET_RULES', data.rules)
    })

    socket.on('UPDATE_RULE_LIST', function(data) {
      store.commit('SET_RULES', data)
    })

    socket.on('intercept', function(data) {
      switch (data.intercept.type) {
        case 'request':
          store.commit(types.ADD_NEW_REQUEST, data)
          break
        case 'response':
          store.commit(types.ADD_NEW_RESPONSE, data)
          break
      }
    })

    store.subscribe(mutation => {
      if (mutation.type === types.UPDATE_RULE) {
        // Updating a rule
        socket.emit('UPDATE_RULE', mutation.payload.rule || mutation.payload)
      } else if (mutation.type === types.RESUME_INTERCEPT) {
        // Resuming intercept
        socket.emit(mutation.payload.intercept.id, mutation.payload)
      } else if (mutation.type === types.ADD_NEW_RULE) {
        // Add a new rule
        socket.emit('ADD_RULE', JSON.parse(JSON.stringify(store.state.newRule)))
      }
    })
  }
}
