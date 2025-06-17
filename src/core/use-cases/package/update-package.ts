import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { UpdatePackageRequest, Package } from '../../entities/package.js';

export class UpdatePackageUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(id: string, request: UpdatePackageRequest): Promise<Package> {
    return this.client.request<Package>('PUT', `/packages/${id}`, request);
  }
}