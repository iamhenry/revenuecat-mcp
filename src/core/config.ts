import { config as dotenvConfig } from 'dotenv-safe';

export interface Config {
  revenueCatSecretKey: string;
  revenueCatApiUrl: string;
  logLevel: string;
}

export function loadConfig(): Config {
  dotenvConfig({
    allowEmptyValues: false,
    example: '.env.example'
  });

  return {
    revenueCatSecretKey: process.env.REVENUECAT_SECRET_KEY!,
    revenueCatApiUrl: process.env.RC_API_URL || 'https://api.revenuecat.com/v2',
    logLevel: process.env.LOG_LEVEL || 'info'
  };
}