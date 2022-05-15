#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { program } from 'commander';

// import pkg from '../../package.json';
import { Hijacker } from '../hijacker.js';

// Define CLI
program
  .option('-c, --config <path>', 'set path to hijacker configuration', `hijacker.config.json`)
  .version('1.0.0')
  .parse(process.argv);

const options = program.opts();

// TODO: Restructure to take in options as argument
let rc = {};

(async () => {
  // TODO: Figure out a better way to read in rules (and watch?)
  try {
    let configPath = options.config;

    if (!path.isAbsolute(options.config)) {
      configPath = path.join(process.cwd(), configPath);
    }
    
    // TODO: allow config to be JS file as well with dynamic import
    rc = JSON.parse(fs.readFileSync(configPath).toString());
  } catch (e) {
    // No config file. Create and start again
    console.error('No config file found: Please set up a config file and start again');
    process.exit(1);
  }

  const server = new Hijacker(rc as any);
  server.on('started', (port: any) => {
    console.log(`Application is listening on port ${port}`);
  });
})();

