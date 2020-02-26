import * as types from '@/store/types'

// Initial State
const initialState = {
  intercepts: []
}

// Actions
const actions = {

}

// Getters
const getters = {
  [types.GET_INTERCEPTS]: state => state.intercepts
}

// Mutations
const mutations = {
  [types.ADD_INTERCEPT] (state, intercept) {
    state.intercepts.push(intercept)
  },

  [types.REMOVE_INTERCEPT] (state, { intercept }) {
    const index = state.intercepts.findIndex(x => x.intercept.id === intercept.id)

    state.intercepts.splice(index, 1)
  }
}

export default {
  state: initialState,
  actions,
  getters,
  mutations
}
