import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { CreateProductRequest, Product } from '../../entities/product.js';

export class CreateProductUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(projectId: string, request: CreateProductRequest): Promise<Product> {
    return this.client.request<Product>('POST', `/projects/${projectId}/products`, request);
  }
}