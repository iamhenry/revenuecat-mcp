import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { ListEntitlementsResponse } from '../../entities/entitlement.js';

export class ListEntitlementsUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(cursor?: string): Promise<ListEntitlementsResponse> {
    const params = cursor ? { cursor } : undefined;
    return this.client.request<ListEntitlementsResponse>('GET', '/entitlements', undefined, params);
  }
}