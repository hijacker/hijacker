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
      store.commit(types.ADD_HISTORY_ITEM, {
        stage: 'CLIENT_REQUEST',
        item: data
      })
    })

    socket.on('CLIENT_RESPONSE', data => {
      store.commit(types.ADD_HISTORY_ITEM, {
        stage: 'CLIENT_RESPONSE',
        item: data
      })
    })

    socket.on('INTERCEPT', data => {
      store.commit(types.ADD_INTERCEPT, data)
      store.commit(types.ADD_HISTORY_ITEM, {
        stage: `INTERCEPT_${data.intercept.type.toUpperCase()}`,
        item: data
      })
    })

    store.subscribe(mutation => {
      switch (mutation.type) {
        case types.UPDATE_RULE:
          socket.emit('UPDATE_RULE', mutation.payload)
          break
        case types.COMPLETE_REQ_INTERCEPT:
          socket.emit(mutation.payload.INTERCEPT_REQUEST.intercept.id, mutation.payload.INTERCEPT_REQUEST)
          break
        case types.COMPLETE_RES_INTERCEPT:
          socket.emit(mutation.payload.INTERCEPT_RESPONSE.intercept.id, mutation.payload.INTERCEPT_RESPONSE)
          break
      }
    })
  }
}
