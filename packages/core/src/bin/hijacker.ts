#!/usr/bin/env node
import path from 'node:path';

import { program } from 'commander';

// import pkg from '../../package.json';
import { Hijacker } from '../hijacker.js';
import type { Config } from '../types/index.js';
import { jsonImporter, tsImporter } from './importers/index.js';

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

    const fileExt = path.extname(configPath);
    
    if (fileExt === '.js') {
      rc = (await import(configPath)).default;
    } else if (fileExt === '.ts') {
      rc = await tsImporter(configPath);
    } else {
      rc = jsonImporter(configPath);
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

