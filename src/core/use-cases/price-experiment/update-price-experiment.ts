import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { UpdatePriceExperimentRequest, PriceExperiment } from '../../entities/price-experiment.js';

export class UpdatePriceExperimentUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(id: string, request: UpdatePriceExperimentRequest): Promise<PriceExperiment> {
    return this.client.request<PriceExperiment>('PUT', `/price-experiments/${id}`, request);
  }
}