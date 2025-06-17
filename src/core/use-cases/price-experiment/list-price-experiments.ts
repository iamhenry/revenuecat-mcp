import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { ListPriceExperimentsResponse } from '../../entities/price-experiment.js';

export class ListPriceExperimentsUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(cursor?: string): Promise<ListPriceExperimentsResponse> {
    const params = cursor ? { cursor } : undefined;
    return this.client.request<ListPriceExperimentsResponse>('GET', '/price-experiments', undefined, params);
  }
}