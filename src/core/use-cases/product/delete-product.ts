import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';

export class DeleteProductUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(id: string): Promise<void> {
    return this.client.request<void>('DELETE', `/products/${id}`);
  }
}