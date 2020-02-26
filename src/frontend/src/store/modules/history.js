import * as types from '@/store/types'

// Initial State
const initialState = {
  history: []
}

// Actions
const actions = {

}

// Getters
const getters = {
  [types.GET_HISTORY]: state => state.history
}

// Mutations
const mutations = {
  [types.ADD_HISTORY_ITEM] (state, { stage, item }) {
    const index = state.history.findIndex(x => x.id === item.id)

    if (index !== -1) {
      const val = {
        ...state.history[index],
        [stage]: item
      }

      state.history.splice(index, 1, val)
    } else {
      state.history.push({
        id: item.id,
        intReqDone: false,
        intResDone: false,
        [stage]: item
      })
    }
  },

  [types.CLEAR_HISTORY] (state) {
    state.history = []
  },

  [types.COMPLETE_REQ_INTERCEPT] (state, { id }) {
    const index = state.history.findIndex(x => x.id === id)
    const val = {
      ...state.history[index],
      intReqDone: true
    }

    state.history.splice(index, 1, val)
  },

  [types.COMPLETE_RES_INTERCEPT] (state, { id }) {
    const index = state.history.findIndex(x => x.id === id)
    const val = {
      ...state.history[index],
      intResDone: true
    }

    state.history.splice(index, 1, val)
  }
}

export default {
  state: initialState,
  actions,
  getters,
  mutations
}
