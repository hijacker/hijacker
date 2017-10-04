const path = require('path')

const packageInfo = require('../../../package.json')

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

// TODO: Move reading config file into CLI. Need to refactor app.js
const config = () => {
  let rc = {}

  // TODO: Figure out a better way to read in rules (and watch?)
  try {
    // eslint-disable-next-line
    rc = require(path.join(process.cwd(), `${packageInfo.name}.config`))
  } catch (e) {
    // No config file. Create and start again
    console.error('No config file found: Please set up a config file and start again')
    process.exit(1)
  }

  return read(rc)
}

/**
 * Validate configuration
 *
 * TODO: More advanced type checking and return invalid fields
 *
 * @param  {Object} config - Hijacker configuration object to validate
 * @return {boolean} True if config is valid, false otherwise
 */
const validate = (config) => {
  return typeof config === 'object'
    && Object.prototype.hasOwnProperty.call(config, 'base_url')
}

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
  read,
  config: config()
}
