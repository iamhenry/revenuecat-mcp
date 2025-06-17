import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { Offering } from '../../entities/offering.js';

export class GetOfferingUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(projectId: string, id: string): Promise<Offering> {
    return this.client.request<Offering>('GET', `/projects/${projectId}/offerings/${id}`);
  }
}