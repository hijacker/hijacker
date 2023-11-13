import type { LogLevel, LoggerOptions } from '../schemas/index.js';
import { LOG_LEVELS } from '../schemas/index.js';

export class Logger {
  level: LogLevel;

  constructor({ level }: LoggerOptions = {}) {
    this.level = level ?? 'INFO';
  }

  log(level: Exclude<LogLevel, 'NONE'>, ...args: any[]) {
    if (LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(this.level)) {
      console.log(`[${level}]`, ...args);
    }
  }
}