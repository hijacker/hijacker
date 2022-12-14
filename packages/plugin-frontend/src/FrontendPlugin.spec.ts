import { describe, expect, it } from 'vitest';

import { FrontendPlugin } from './FrontendPlugin.js';

describe('FrontendPlugin', () => {
  it('create FrontendPlugin instance', () => {
    const frontendPlugin = new FrontendPlugin({ port: 3001 });

    expect(frontendPlugin).toBeInstanceOf(FrontendPlugin);
  });
});