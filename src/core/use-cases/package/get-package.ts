import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { Package } from '../../entities/package.js';

export class GetPackageUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(id: string): Promise<Package> {
    return this.client.request<Package>('GET', `/packages/${id}`);
  }
}