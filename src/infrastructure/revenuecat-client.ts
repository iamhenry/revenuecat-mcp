import { Config } from '../core/config.js';
import { Logger } from 'pino';

export class RevenueCatClient {
  constructor(
    private config: Config,
    private logger: Logger
  ) {}

  async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    endpoint: string,
    body?: any,
    params?: Record<string, string>
  ): Promise<T> {
    let url = `${this.config.revenueCatApiUrl}${endpoint}`;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }
    const requestId = crypto.randomUUID();
    
    this.logger.info({ requestId, method, url }, 'HTTP request started');
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${this.config.revenueCatSecretKey}`,
        'Content-Type': 'application/json',
        'X-Request-ID': requestId
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error({ requestId, status: response.status, error }, 'HTTP request failed');
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const data = await response.json();
    this.logger.info({ requestId }, 'HTTP request completed');
    return data;
  }
}