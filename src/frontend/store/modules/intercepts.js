import * as types from '../types'

// Initial state for intercepted rules
const initialState = []

const getters = {

}

const actions = {

}

const mutations = {
  [types.ADD_NEW_REQUEST] (state, data) {
    state.push(data)
  },

  [types.ADD_NEW_RESPONSE] (state, data) {
    state.push(data)
  },

  [types.RESUME_INTERCEPT] (state, { intercept }) {
    const index = state.findIndex( int => int.intercept.id = intercept.id)
    state.splice(index, 1)
  }
}

export default {
  state: initialState,
  getters,
  actions,
  mutations
}
