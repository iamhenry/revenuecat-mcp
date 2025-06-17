import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { ListPackagesResponse } from '../../entities/package.js';

export class ListPackagesUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(cursor?: string): Promise<ListPackagesResponse> {
    const params = cursor ? { cursor } : undefined;
    return this.client.request<ListPackagesResponse>('GET', '/packages', undefined, params);
  }
}