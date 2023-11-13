#!/usr/bin/env node
import path from 'node:path';

import { program } from 'commander';
import { ZodError } from 'zod';

import { ImportError, jsImporter, jsonImporter, tsImporter } from './importers/index.js';
import { getPackageVersion } from './utils.js';
import { Hijacker } from '../hijacker.js';
import { Config as ConfigSchema } from '../schemas/index.js';
import type { Config } from '../schemas/index.js';

// Define CLI
program
  .option('-c, --config <path>', 'set path to hijacker configuration', 'hijacker.config.js')
  .version(getPackageVersion())
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

    config = ConfigSchema.parse(rc);
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      console.error(`Config file '${options.config}' is invalid. Please fix the following issues:`);
      e.errors.forEach((error) => {
        // TODO: Can still better format errors
        console.error(`- '${error.path}' ${error.message}`);
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

