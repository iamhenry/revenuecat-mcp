import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { UpdateOfferingRequest, Offering } from '../../entities/offering.js';

export class UpdateOfferingUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(id: string, request: UpdateOfferingRequest): Promise<Offering> {
    return this.client.request<Offering>('PATCH', `/offerings/${id}`, request);
  }
}