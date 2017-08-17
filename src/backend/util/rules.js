const DEFAULT_RULE = {
  // Allow "breakpoint" on original request before sent to api
  interceptRequest: false,

  // Allow "breakpoint" on response from api before sent to client
  interceptResponse: false,

  // Allow skipping going to the api all together
  skipApi: false,

  // Rule disabled. If true, rule wont be run
  disabled: false
}

const match = function(list, req) {
  return list.filter((rule) => {
    // Make sure path and method match and rule is enabled
    return !rule.disabled && rule.path === req.originalUrl
                          && (!rule.hasOwnProperty('method') || rule.method === req.method)
  })[0] || DEFAULT_RULE
}

const read = function(ruleList) {
  let rules = []

  for (let i = 0; i < ruleList.length; i++) {
    rules.push(Object.assign({}, DEFAULT_RULE, ruleList[i], { id: i }))
  }

  return rules
}

module.exports = {
  match: match,
  read: read
}
