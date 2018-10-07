import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'

import createWebSocketPlugin from '@/store/sockets'

import RuleModule from '@/store/modules/rules'

Vue.use(Vuex)

// eslint-disable-next-line no-undef
const socketPlugin = createWebSocketPlugin(io(SOCKET_HOST))

export default new Vuex.Store({
  modules: {
    rules: RuleModule
  },
  plugins: [socketPlugin],
  // eslint-disable-next-line no-undef
  strict: process.env.NODE_ENV !== 'production'
})
