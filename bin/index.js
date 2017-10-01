#!/usr/bin/env node

const program = require('commander')

const pkg = require('../package')

// Define CLI
program
  // .option('-c, --config <path>', 'set path to hijacker configuration')
  .version(pkg.version)
  .parse(process.argv)

// TODO: Restructure to take in options as argument
require('../index.js')
