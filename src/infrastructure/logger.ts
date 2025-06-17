import pino from 'pino';
import { Config } from '../core/config.js';

export function createLogger(config?: Config) {
  return pino({
    level: config?.logLevel || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: ['config.revenueCatSecretKey', '*.secret*', '*.token*']
  });
}