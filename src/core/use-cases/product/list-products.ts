import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { ListProductsResponse } from '../../entities/product.js';

export class ListProductsUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(projectId: string, cursor?: string): Promise<ListProductsResponse> {
    const params = cursor ? { cursor } : undefined;
    return this.client.request<ListProductsResponse>('GET', `/projects/${projectId}/products`, undefined, params);
  }
}