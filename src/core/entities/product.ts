export interface Product {
  id: string;
  identifier: string;
  name: string;
  description?: string;
  type: 'subscription' | 'non_consumable' | 'consumable';
  store_identifiers: { [store: string]: string };
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  identifier: string;
  name: string;
  description?: string;
  type: 'subscription' | 'non_consumable' | 'consumable';
  store_identifiers?: { [store: string]: string };
}

export interface UpdateProductRequest {
  identifier?: string;
  name?: string;
  description?: string;
  type?: 'subscription' | 'non_consumable' | 'consumable';
  store_identifiers?: { [store: string]: string };
}

export interface ListProductsResponse {
  products: Product[];
  cursor?: string;
}