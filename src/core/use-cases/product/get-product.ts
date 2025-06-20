import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { Product } from '../../entities/product.js';

export class GetProductUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(projectId: string, id: string): Promise<Product> {
    return this.client.request<Product>('GET', `/projects/${projectId}/products/${id}`);
  }
}