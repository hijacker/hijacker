import * as types from '@/store/types'

export default socket => {
  return store => {
    // Events from sockets
    socket.on('SETTINGS', data => {
      store.commit(types.SET_RULES, data.rules)
    })

    socket.on('UPDATE_RULES', data => {
      store.commit(types.SET_RULES, data)
    })

    // Request Lifecyle
    socket.on('CLIENT_REQUEST', data => {
      // eslint-disable-next-line no-console, no-undef
      console.log('CLIENT_REQUEST', data)
    })

    socket.on('CLIENT_RESPONSE', data => {
      // eslint-disable-next-line no-console, no-undef
      console.log('CLIENT_RESPONSE', data)
    })

    socket.on('INTERCEPT', data => {
      store.commit(types.ADD_INTERCEPT, data)
    })

    store.subscribe(mutation => {
      switch (mutation.type) {
        case types.UPDATE_RULE:
          socket.emit('UPDATE_RULE', mutation.payload)
          break
        case types.REMOVE_INTERCEPT:
          socket.emit(mutation.payload.intercept.id, mutation.payload)
          break
      }
    })
  }
}
