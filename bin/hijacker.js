#!/usr/bin/env node

const path = require('path')
const { program } = require('commander')

const pkg = require('../package')
const Hijacker = require('../lib/hijacker')

// Define CLI
program
  .option('-c, --config <path>', 'set path to hijacker configuration', `${pkg.name}.config`)
  .version(pkg.version)
  .parse(process.argv)

const options = program.opts();

// TODO: Restructure to take in options as argument
let rc = {}

// TODO: Figure out a better way to read in rules (and watch?)
try {
  let configPath = options.config;

  if (!path.isAbsolute(options.config)) {
    configPath = path.join(process.cwd(), configPath)
  }
  // eslint-disable-next-line
  rc = require(configPath)
} catch (e) {
  // No config file. Create and start again
  console.error('No config file found: Please set up a config file and start again')
  process.exit(1)
}
const server = new Hijacker(rc)
server.on('started', (port) => {
  console.log(`Application is listening on port ${port}`)
})
