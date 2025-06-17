export interface Package {
  id: string;
  identifier: string;
  name: string;
  position?: number;
  product_identifiers: string[];
  created_at: string;
  updated_at: string;
}

export interface CreatePackageRequest {
  identifier: string;
  name: string;
  position?: number;
  product_identifiers?: string[];
}

export interface UpdatePackageRequest {
  identifier?: string;
  name?: string;
  position?: number;
  product_identifiers?: string[];
}

export interface ListPackagesResponse {
  packages: Package[];
  cursor?: string;
}