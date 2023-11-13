import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const getPackageVersion = () => {
  return JSON.parse(readFileSync(resolve(__dirname, '../../package.json')).toString()).version;
};
