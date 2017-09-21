const path = require('path')

const packageInfo = require('../../../package.json')

const config = () => {
  // Set default configs
  const DEFAULTS = {
    // Port to run hijacker on
    port: 3005,

    // Ussed for global settings
    global: {
      // Headers to forward to the api server
      keep_headers: [],

      // Headers to allow in access-control-allow-headers
      allow_headers: []
    },

    // List of rules
    rules: []
  }

  let rc = {}

  // Look for rc file in
  try {
    rc = require(path.join(process.cwd(), `${packageInfo.name}.config`))
  } catch (e) {
    // No config file. Create and start again
    console.log(e)
    console.error('No config file found: Please set up a config file and start again')
    process.exit(1)
  }

  const settings = Object.assign({}, DEFAULTS, rc)

  // Set
  if (!Object.prototype.hasOwnProperty.call(settings, 'base_url')) {
    console.error('No base_url found. Add a base_url to continue')
    process.exit(1)
  }

  return settings
}

module.exports = config()
