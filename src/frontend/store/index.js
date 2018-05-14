import Vue from 'vue'
import Vuex from 'vuex'

import RuleModule from '@/store/modules/rules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    rules: RuleModule
  },
  // eslint-disable-next-line no-undef
  strict: process.env.NODE_ENV !== 'production'
})
