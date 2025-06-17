import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { PriceExperiment } from '../../entities/price-experiment.js';

export class GetPriceExperimentUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(id: string): Promise<PriceExperiment> {
    return this.client.request<PriceExperiment>('GET', `/price-experiments/${id}`);
  }
}