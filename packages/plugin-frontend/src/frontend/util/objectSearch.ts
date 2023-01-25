
export const objectSearch = <T extends Record<string, unknown>>(arr: T[], filter: string): T[] => {
  return arr.reduce((acc, cur) => {
    let match = false;

    // Search all top level key values for filter
    // Could make this more complex to search nested objects if needed
    for (const val of Object.values(cur)) {
      if (typeof val === 'string' && val.indexOf(filter) !== -1) {
        match = true;
        break;
      } 
    }

    return [...acc, ...(match ? [cur] : [])];
  }, [] as T[]);
};