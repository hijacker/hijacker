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
      const val = state.history[index]

      state.history.splice(index, 1, {
        ...val,
        [stage]: item
      })
    } else {
      state.history.push({
        id: item.id,
        [stage]: item
      })
    }
  },

  [types.CLEAR_HISTORY] (state) {
    state.history = []
  }
}

export default {
  state: initialState,
  actions,
  getters,
  mutations
}
