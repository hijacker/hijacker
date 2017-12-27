import * as types from '../types'

// Initial state for new rules
const initialState = [{
  'id': 0,
  'path': '/example-route',
  'skipApi': true,
  'method': 'PUT',
  'status': 400,
  'body': {
    'Hello': 'World',
    'method': 'GET'
  },
  'disabled': false
}]

const getters = {

}

const actions = {

}

const mutations = {
  [types.UPDATE_RULE] (state, rule) {
    const index = state.findIndex(r => r.id === rule.id)
    state[index] = rule
  }
}

export default {
  state: initialState,
  getters,
  actions,
  mutations
}
