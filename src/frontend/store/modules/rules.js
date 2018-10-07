import * as types from '@/store/types'

// Initial State
const initialState = {
  rules: []
}

// Actions
const actions = {

}

// Getters
const getters = {
  [types.GET_RULES]: state => state.rules,
  [types.GET_RULE_BY_ID]: state => id => state.rules.find(r => r.id === id)
}

// Mutations
const mutations = {
  [types.ADD_RULE] (state, rule) {
    state.rules.push(rule)
  },

  [types.UPDATE_RULE] (state, rule) {
    const index = state.rules.findIndex(r => r.id === rule.id)
    state.rules.splice(index, 1, rule)
  },

  [types.SET_RULES] (state, rules) {
    state.rules = rules
  }
}

export default {
  state: initialState,
  actions,
  getters,
  mutations
}
