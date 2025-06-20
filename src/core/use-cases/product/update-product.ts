import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { UpdateProductRequest, Product } from '../../entities/product.js';

export class UpdateProductUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(projectId: string, id: string, request: UpdateProductRequest): Promise<Product> {
    return this.client.request<Product>('PATCH', `/projects/${projectId}/products/${id}`, request);
  }
}