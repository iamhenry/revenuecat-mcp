export interface PriceExperiment {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'completed';
  treatment_group_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePriceExperimentRequest {
  name: string;
  description?: string;
  status?: 'active' | 'inactive' | 'completed';
  treatment_group_percentage: number;
}

export interface UpdatePriceExperimentRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'completed';
  treatment_group_percentage?: number;
}

export interface ListPriceExperimentsResponse {
  price_experiments: PriceExperiment[];
  cursor?: string;
}