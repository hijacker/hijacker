const { v4: uuid } = require('uuid');
const { routeMatcher } = require('route-matcher')

/**
 * Default values for a hijacker rule
 *
 * @constant
 * @type {Object}
 * @default
 */
const DEFAULT_RULE = {
  // TODO: Add all possible rule values here (undefined if need be, will require some rework)
  /**
   * Flag to disable a rule
   *
   * @type {boolean}
   * @inner
   */
  disabled: false,

  /**
   * Allow "breakpoint" on original request before sent to api
   *
   * @type {boolean}
   * @inner
   */
  interceptRequest: false,

  /**
   * Allow "breakpoint" on response from api before sent to client
   *
   * @type {boolean}
   * @inner
   */
  interceptResponse: false,

  /**
   * Name of route, display purposes only
   *
   * @type {string}
   * @inner
   */
  name: undefined,

  /**
   * Route the requested url path to a different one in the api
   *
   * @type {boolean}
   * @inner
   */
  routeTo: undefined,

  /**
   * Allow skipping going to the api all together
   *
   * @type {boolean}
   * @inner
   */
  skipApi: false
}

/**
 * Match a reques to a rule from a list
 *
 * @param {Array<Object>} list - List of rules to match from
 * @param {Request} req - Express request object to match
 * @return {Object} Rule that matches the given request. Default rule if no match
 */
const match = (list, req) => (
  list.find(rule => (
    // Make sure path and method match and rule is enabled
    !rule.disabled && !!routeMatcher(rule.path).parse(req.originalUrl) &&
      (!Object.prototype.hasOwnProperty.call(rule, 'method') || rule.method === req.method || rule.method === 'ALL')
  )) || DEFAULT_RULE
)

/**
 * Read in a rule. Apply default values where needed
 *
 * @param {Object} rule - Rule to read in and modify if needed
 * @return {Object} Rule with default values filled in where needed
 */
const read = (rule, keepId) => {
  const id = (keepId === true) ? rule.id : uuid()

  // TODO: Validate rule and add functionality to check depricaded functions
  return Object.assign({}, DEFAULT_RULE, rule, { id })
}

// TODO: Get rule. Function that gets rule value based on rule/global/default

module.exports = {
  match,
  read,
  DEFAULT_RULE
}
