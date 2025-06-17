import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { CreateOfferingRequest, Offering } from '../../entities/offering.js';

export class CreateOfferingUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(request: CreateOfferingRequest): Promise<Offering> {
    return this.client.request<Offering>('POST', '/offerings', request);
  }
}