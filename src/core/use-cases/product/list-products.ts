import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { ListProductsResponse } from '../../entities/product.js';

export class ListProductsUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(cursor?: string): Promise<ListProductsResponse> {
    const params = cursor ? { cursor } : undefined;
    return this.client.request<ListProductsResponse>('GET', '/products', undefined, params);
  }
}