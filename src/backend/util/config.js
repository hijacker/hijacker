const path = require('path')
const util = require('util')
const package = require('../../../package.json')

const config = () => {
  // Set default configs
  const DEFAULTS = {
    base_url: 'http://google.com',
    port: 3005,
    rules: []
  }

  let rc = {}

  // Look for rc file in
  try {
    rc = require(path.join(process.cwd(), `${package.name}.config.json`))
  } catch (e) {
    // No config file. Create and start again
  }

  return util._extend(DEFAULTS, rc)
}

module.exports = config()
