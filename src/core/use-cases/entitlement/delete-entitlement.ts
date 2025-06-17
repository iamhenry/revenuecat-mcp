import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';

export class DeleteEntitlementUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(id: string): Promise<void> {
    return this.client.request<void>('DELETE', `/entitlements/${id}`);
  }
}