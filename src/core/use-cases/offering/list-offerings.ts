import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { ListOfferingsResponse } from '../../entities/offering.js';

export class ListOfferingsUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(projectId: string, cursor?: string): Promise<ListOfferingsResponse> {
    const params = cursor ? { cursor } : undefined;
    return this.client.request<ListOfferingsResponse>('GET', `/projects/${projectId}/offerings`, undefined, params);
  }
}