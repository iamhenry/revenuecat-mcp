import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { CreateEntitlementRequest, Entitlement } from '../../entities/entitlement.js';

export class CreateEntitlementUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(request: CreateEntitlementRequest): Promise<Entitlement> {
    return this.client.request<Entitlement>('POST', '/entitlements', request);
  }
}