#!/usr/bin/env node
import path from 'node:path';

import { program } from 'commander';

// import pkg from '../../package.json';
import { ImportError, jsImporter, jsonImporter, tsImporter } from './importers/index.js';
import { Hijacker } from '../hijacker.js';
import type { Config } from '../schemas/index.js';
import { validateConfig, ValidationError } from '../validation/index.js';

// Define CLI
// TODO: Read in package.json to correctly set version
program
  .option('-c, --config <path>', 'set path to hijacker configuration', 'hijacker.config.js')
  .version('1.0.0')
  .parse(process.argv);

const options = program.opts();

// TODO: Restructure to take in options as argument
let config: Config;

(async () => {
  // TODO: Figure out a better way to read in rules (and watch?)
  try {
    let configPath = options.config;
    let rc: unknown;

    if (!path.isAbsolute(options.config)) {
      configPath = path.join(process.cwd(), configPath);
    }

    const fileExt = path.extname(configPath);
    
    if (fileExt === '.js' || fileExt === '.mjs' || fileExt === '.cjs') {
      rc = await jsImporter(configPath);
    } else if (fileExt === '.ts') {
      rc = await tsImporter(configPath);
    } else {
      rc = jsonImporter(configPath);
    }

    config = validateConfig(rc);
  } catch (e: unknown) {
    if (e instanceof ValidationError) {
      console.error(`Config file '${options.config}' is invalid. Please fix the following issues:`);
      e.errors.forEach((val) => {
        // TODO: Can still better format errors
        console.error(`- '${val.instancePath}' ${val.message}`);
      });
    } else if (e instanceof ImportError) {
      console.error('There was an error loading your config file. Please check it for errors');
    } else {
      console.error('There was an error starting up Hijacker', e);
    }

    process.exit(1);
  }

  const server = new Hijacker(config);
  server.on('started', (port: number) => {
    console.log(`Application is listening on port ${port}`);
  });
})();

