import * as types from '../types'

// Initial state for new rules
const initialState = {
  path: '',
  status: '',
  method: 'ALL',
  body: ''
}

const state = {
  ...initialState
}

const getters = {

}

const actions = {

}

const mutations = {
  [types.UPDATE_PATH] (state, value) {
    state.path = value
  },

  [types.UPDATE_STATUS] (state, value) {
    state.status = value
  },

  [types.UPDATE_METHOD] (state, value) {
    state.method = value
  },

  [types.UPDATE_BODY] (state, value) {
    state.body = value
  },

  // eslint-disable-next-line no-unused-vars
  [types.CLEAR_NEW_RULE] (state) {
    state.path = initialState.path
    state.status = initialState.status
    state.method = initialState.method
    state.body = initialState.body
  },

  // eslint-disable-next-line no-unused-vars
  [types.ADD_NEW_RULE] (state) {

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
