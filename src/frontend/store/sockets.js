import * as types from '@/store/types'

export default socket => {
  return store => {
    // Events from sockets
    socket.on('SETTINGS', data => {
      store.commit(types.SET_RULES, data.rules)
    })

    socket.on('UPDATE_RULES', data => {
      // eslint-disable-next-line no-console, no-undef
      console.log('UPDATE_RULES', data)
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

    socket.on('intercept', data => {
      switch (data.intercept.type) {
        case 'request':
          // Request Intercept
          break
        case 'response':
          // Response Intercept
          break
      }
    })

    store.subscribe(mutation => {
      // LIsten to mutations to send data back to server
      // eslint-disable-next-line no-console, no-undef
      console.log(mutation)
    })
  }
}
