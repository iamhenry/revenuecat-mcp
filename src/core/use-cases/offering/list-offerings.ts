import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { ListOfferingsResponse } from '../../entities/offering.js';

export class ListOfferingsUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(cursor?: string): Promise<ListOfferingsResponse> {
    const params = cursor ? { cursor } : undefined;
    return this.client.request<ListOfferingsResponse>('GET', '/offerings', undefined, params);
  }
}