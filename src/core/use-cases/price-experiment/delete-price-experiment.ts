import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';

export class DeletePriceExperimentUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(id: string): Promise<void> {
    await this.client.request<void>('DELETE', `/price-experiments/${id}`);
  }
}