import { Config } from '../core/config.js';
import { Logger } from 'pino';

export class RevenueCatClient {
  constructor(
    private config: Config,
    private logger: Logger
  ) {}

  async retry<T>(operation: () => Promise<T>, maxAttempts = 3): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        
        // Only retry on retryable errors (5xx, network errors, timeouts)
        if (!this.isRetryableError(error)) {
          throw error;
        }
        
        const delay = Math.min(200 * Math.pow(2, attempt - 1), 2000);
        this.logger.warn({ attempt, maxAttempts, delay }, 'Request failed, retrying');
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max attempts exceeded');
  }

  private isRetryableError(error: any): boolean {
    // Don't retry on client errors (4xx)
    if (error.message && error.message.includes('HTTP 4')) {
      return false;
    }
    
    // Retry on server errors (5xx), network errors, and timeouts
    if (error.message && (
      error.message.includes('HTTP 5') ||
      error.name === 'TypeError' ||  // Network errors
      error.name === 'AbortError' || // Timeout errors
      error.code === 'ECONNRESET' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNREFUSED'
    )) {
      return true;
    }
    
    return false;
  }

  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
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
    
    return this.retry(async () => {
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
    });
  }
}