export interface Offering {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  packages: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateOfferingRequest {
  name: string;
  description?: string;
  is_default?: boolean;
  packages?: string[];
}

export interface UpdateOfferingRequest {
  name?: string;
  description?: string;
  is_default?: boolean;
  packages?: string[];
}

export interface ListOfferingsResponse {
  offerings: Offering[];
  cursor?: string;
}