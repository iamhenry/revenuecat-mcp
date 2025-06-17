import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { CreatePriceExperimentRequest, PriceExperiment } from '../../entities/price-experiment.js';

export class CreatePriceExperimentUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(request: CreatePriceExperimentRequest): Promise<PriceExperiment> {
    return this.client.request<PriceExperiment>('POST', '/price-experiments', request);
  }
}