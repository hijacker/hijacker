const logLevels = [
  'SILLY',
  'DEBUG',
  'HTTP',
  'INFO',
  'WARN',
  'ERROR',
  'NONE'
] as const;

export type LogLevel = typeof logLevels[number];

export interface LoggerOptions {
  level: LogLevel;
}

export class Logger {
  level: LogLevel = 'INFO';

  log(level: Exclude<LogLevel, 'NONE'>, message: any) {
    if (logLevels.indexOf(level) >= logLevels.indexOf(this.level)) {
      console.log(`[${level}] ${message}`);
    }
  }
}