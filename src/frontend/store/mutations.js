export default {
  ADD_RULE(state, rule) {
    state.rules.push(rule)
  },
  SET_RULES(state, rules) {
    state.rules = rules
  }
}
