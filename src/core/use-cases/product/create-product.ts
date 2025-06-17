import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { CreateProductRequest, Product } from '../../entities/product.js';

export class CreateProductUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(request: CreateProductRequest): Promise<Product> {
    return this.client.request<Product>('POST', '/products', request);
  }
}