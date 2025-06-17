import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { Entitlement } from '../../entities/entitlement.js';

export class GetEntitlementUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(id: string): Promise<Entitlement> {
    return this.client.request<Entitlement>('GET', `/entitlements/${id}`);
  }
}