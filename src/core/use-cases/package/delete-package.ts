import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';

export class DeletePackageUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(id: string): Promise<void> {
    await this.client.request<void>('DELETE', `/packages/${id}`);
  }
}