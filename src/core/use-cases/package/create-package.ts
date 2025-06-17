import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { CreatePackageRequest, Package } from '../../entities/package.js';

export class CreatePackageUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(request: CreatePackageRequest): Promise<Package> {
    return this.client.request<Package>('POST', '/packages', request);
  }
}