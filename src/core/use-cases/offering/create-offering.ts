import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { CreateOfferingRequest, Offering } from '../../entities/offering.js';

export class CreateOfferingUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(projectId: string, request: CreateOfferingRequest): Promise<Offering> {
    return this.client.request<Offering>('POST', `/projects/${projectId}/offerings`, request);
  }
}