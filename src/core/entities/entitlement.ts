export interface Entitlement {
  id: string;
  identifier: string;
  name: string;
  description?: string;
  product_identifiers: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateEntitlementRequest {
  identifier: string;
  name: string;
  description?: string;
  product_identifiers?: string[];
}

export interface UpdateEntitlementRequest {
  identifier?: string;
  name?: string;
  description?: string;
  product_identifiers?: string[];
}

export interface ListEntitlementsResponse {
  entitlements: Entitlement[];
  cursor?: string;
}