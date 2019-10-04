/**
 * Default configuration for hijacker
 *
 * @type {Object}
 */
const DEFAULT_CONFIG = {
  port: 3005,
  globalRule: {},
  rules: []
}

/**
 * Validate configuration
 *
 * TODO: More advanced type checking and return invalid fields
 *
 * @param  {Object} config - Hijacker configuration object to validate
 * @return {boolean} True if config is valid, false otherwise
 */
const validate = config => (
  typeof config === 'object' &&
    Object.prototype.hasOwnProperty.call(config, 'base_url')
)

/**
 * Read in config and apply defaults where needed
 *
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
const read = (config) => {
  const settings = Object.assign({}, DEFAULT_CONFIG, config)

  // Throw error if config invalid
  if (!validate(settings)) {
    throw new Error('Invalid configuration file')
  }

  return settings
}

module.exports = {
  read
}
