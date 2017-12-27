import Vue from 'vue'
import Vuex from 'vuex'

import io from 'socket.io-client'

import createWebSocketPlugin from './plugins/sockets'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

import NewRuleModule from './modules/new-rule'
import RuleModule from './modules/rules'
import InterceptModule from './modules/intercepts'

Vue.use(Vuex)

// Setup Socket Plugin
const socketPlugin = createWebSocketPlugin(io())

export default new Vuex.Store({
  state: {},
  actions,
  getters,
  mutations,
  modules: {
    newRule: NewRuleModule,
    rules: RuleModule,
    intercepts: InterceptModule
  },
  plugins: [socketPlugin]
})
