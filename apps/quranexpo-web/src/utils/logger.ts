// src/utils/logger.ts

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
}

const currentLogLevel: LogLevel = (LogLevel as any)[(import.meta.env.PUBLIC_LOG_LEVEL || 'INFO').toUpperCase()] || LogLevel.INFO;

function log(level: LogLevel, message: string, ...args: any[]): void {
  if (level >= currentLogLevel) {
    const timestamp = new Date().toISOString();
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[${timestamp}] [DEBUG] ${message}`, ...args);
        break;
      case LogLevel.INFO:
        console.info(`[${timestamp}] [INFO] ${message}`, ...args);
        break;
      case LogLevel.WARNING:
        console.warn(`[${timestamp}] [WARNING] ${message}`, ...args);
        break;
      case LogLevel.ERROR:
        console.error(`[${timestamp}] [ERROR] ${message}`, ...args);
        break;
      default:
        console.log(`[${timestamp}] [UNKNOWN] ${message}`, ...args);
    }
  }
}

export const logger = {
  debug: (message: string, ...args: any[]) => log(LogLevel.DEBUG, message, ...args),
  info: (message: string, ...args: any[]) => log(LogLevel.INFO, message, ...args),
  warn: (message: string, ...args: any[]) => log(LogLevel.WARNING, message, ...args),
  error: (message: string, ...args: any[]) => log(LogLevel.ERROR, message, ...args),
};