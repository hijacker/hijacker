import { beforeAll, beforeEach, describe, expect, it, SpyInstance, vi } from 'vitest';

import { Logger } from './Logger';

describe('Logger', () => {
  let consoleSpy: SpyInstance;

  beforeAll(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  beforeEach(() => {
    consoleSpy.mockClear();
  });

  it('should initialize a logger', () => {
    expect.assertions(1);

    const logger = new Logger();

    expect(logger).toBeInstanceOf(Logger);
  });

  it('should set default level to INFO', () => {
    expect.assertions(1);

    const logger = new Logger();

    expect(logger.level).toEqual('INFO');
  });

  it('should console log if logger level is higher than log level', () => {
    expect.assertions(3);

    const logger = new Logger();
    logger.level = 'INFO';

    logger.log('ERROR', 'Test');
    logger.log('WARN', 'Test');
    logger.log('INFO', 'Test');

    expect(consoleSpy).toHaveBeenCalledWith('[ERROR] Test');
    expect(consoleSpy).toHaveBeenCalledWith('[WARN] Test');
    expect(consoleSpy).toHaveBeenCalledWith('[INFO] Test');
  });

  it('should not log if logger level is lower than log level', () => {
    expect.assertions(1);

    const logger = new Logger();
    logger.level = 'HTTP';

    logger.log('SILLY', 'Test');
    logger.log('DEBUG', 'Test');

    expect(consoleSpy).toHaveBeenCalledTimes(0);
  });
});