import * as types from '@/store/types'

// Initial State
const initialState = [
  {
    id: 1,
    name: 'Rule 1',
    path: '/test',
    disabled: false
  },
  {
    id: 2,
    name: 'Rule 2',
    path: '/cars',
    disabled: false
  }
]

// Actions
const actions = {

}

// Getters
const getters = {
  [types.GET_RULES]: state => state,
  [types.GET_RULE_BY_ID]: state => id => state.find(r => r.id === id)
}

// Mutations
const mutations = {
  [types.ADD_RULE] (state, rule) {
    state.push(rule)
  },

  [types.UPDATE_RULE] (state, rule) {
    const index = state.findIndex(r => r.id === rule.id)
    state.splice(index, 1, rule)
  }
}

export default {
  state: initialState,
  actions,
  getters,
  mutations
}
