import { readFileSync } from 'node:fs';

import { ImportError } from './index.js';

export const jsonImporter = (file: string): unknown => {
  try {
    return JSON.parse(readFileSync(file).toString());
  } catch {
    throw new ImportError();
  }
};