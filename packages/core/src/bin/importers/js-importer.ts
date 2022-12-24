import { ImportError } from './index.js';

export const jsImporter = async (file: string): Promise<unknown> => {
  try {
    return (await import(file)).default;
  } catch {
    throw new ImportError();
  }
};