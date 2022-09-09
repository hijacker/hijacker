#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

import { program } from 'commander';

// import pkg from '../../package.json';
import { Hijacker } from '../hijacker.js';
import type { Config } from '../types/index.js';

// Define CLI
// TODO: Read in package.json to correctly set version
program
  .option('-c, --config <path>', 'set path to hijacker configuration', 'hijacker.config.js')
  .version('1.0.0')
  .parse(process.argv);

const options = program.opts();

// TODO: Restructure to take in options as argument
let rc = {} as Config;

(async () => {
  // TODO: Figure out a better way to read in rules (and watch?)
  try {
    let configPath = options.config;

    if (!path.isAbsolute(options.config)) {
      configPath = path.join(process.cwd(), configPath);
    }

    const isJs = path.extname(configPath) === '.js';
    
    if (isJs) {
      rc = (await import(configPath)).default;
    } else {
      rc = JSON.parse(fs.readFileSync(configPath).toString());
    }
  } catch (e) {
    // No config file. Create and start again
    console.error('No config file found: Please set up a config file and start again');
    process.exit(1);
  }

  const server = new Hijacker(rc);
  server.on('started', (port: number) => {
    console.log(`Application is listening on port ${port}`);
  });
})();

