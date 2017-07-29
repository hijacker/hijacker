const path = require('path')

const package = require('../../../package.json')

const config = () => {
  // Set default configs
  const DEFAULTS = {
    port: 3005,
    rules: []
  }

  let rc = {}

  // Look for rc file in
  try {
    rc = require(path.join(process.cwd(), `${package.name}.config`))
  } catch (e) {
    // No config file. Create and start again
    console.log(e)
    console.error('No config file found: Please set up a config file and start again')
    process.exit(1)
  }

  const settings = Object.assign({}, DEFAULTS, rc)

  // Set
  if (!settings.hasOwnProperty('base_url')) {
    console.error('No base_url found. Add a base_url to continue')
    process.exit(1)
  }

  return settings
}

module.exports = config()
