import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';

export class DeleteOfferingUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(projectId: string, id: string): Promise<void> {
    return this.client.request<void>('DELETE', `/projects/${projectId}/offerings/${id}`);
  }
}