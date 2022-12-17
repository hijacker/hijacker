import { readFileSync } from 'node:fs';

export const jsonImporter = (file: string) => {
  return JSON.parse(readFileSync(file).toString());
};