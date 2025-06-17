import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { UpdateEntitlementRequest, Entitlement } from '../../entities/entitlement.js';

export class UpdateEntitlementUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(id: string, request: UpdateEntitlementRequest): Promise<Entitlement> {
    return this.client.request<Entitlement>('PATCH', `/entitlements/${id}`, request);
  }
}