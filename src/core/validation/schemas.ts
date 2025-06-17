import { JSONSchemaType } from 'ajv';

// Base schema for ID parameter (used in get, update, delete operations)
export const IdParamSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 }
  },
  required: ['id'],
  additionalProperties: false
};

// Base schema for project-scoped ID parameter
export const ProjectIdParamSchema = {
  type: 'object',
  properties: {
    project_id: { type: 'string', minLength: 1 },
    id: { type: 'string', minLength: 1 }
  },
  required: ['project_id', 'id'],
  additionalProperties: false
};

// Base schema for cursor-based list operations
export const CursorParamSchema = {
  type: 'object',
  properties: {
    cursor: { type: 'string', minLength: 1, nullable: true }
  },
  required: [],
  additionalProperties: false
};

// Base schema for project-scoped cursor-based list operations
export const ProjectCursorParamSchema = {
  type: 'object',
  properties: {
    project_id: { type: 'string', minLength: 1 },
    cursor: { type: 'string', minLength: 1, nullable: true }
  },
  required: ['project_id'],
  additionalProperties: false
};

// OFFERING SCHEMAS
export const CreateOfferingSchema = {
  type: 'object',
  properties: {
    project_id: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', nullable: true },
    is_default: { type: 'boolean', nullable: true },
    packages: { 
      type: 'array', 
      items: { type: 'string', minLength: 1 },
      nullable: true 
    }
  },
  required: ['project_id', 'name'],
  additionalProperties: false
};

export const UpdateOfferingSchema = {
  type: 'object',
  properties: {
    project_id: { type: 'string', minLength: 1 },
    id: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1, nullable: true },
    description: { type: 'string', nullable: true },
    is_default: { type: 'boolean', nullable: true },
    packages: { 
      type: 'array', 
      items: { type: 'string', minLength: 1 },
      nullable: true 
    }
  },
  required: ['project_id', 'id'],
  additionalProperties: false
};

// ENTITLEMENT SCHEMAS
export const CreateEntitlementSchema = {
  type: 'object',
  properties: {
    identifier: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', nullable: true },
    product_identifiers: { 
      type: 'array', 
      items: { type: 'string', minLength: 1 },
      nullable: true 
    }
  },
  required: ['identifier', 'name'],
  additionalProperties: false
};

export const UpdateEntitlementSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
    identifier: { type: 'string', minLength: 1, nullable: true },
    name: { type: 'string', minLength: 1, nullable: true },
    description: { type: 'string', nullable: true },
    product_identifiers: { 
      type: 'array', 
      items: { type: 'string', minLength: 1 },
      nullable: true 
    }
  },
  required: ['id'],
  additionalProperties: false
};

// PRODUCT SCHEMAS
export const CreateProductSchema = {
  type: 'object',
  properties: {
    project_id: { type: 'string', minLength: 1 },
    identifier: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', nullable: true },
    type: { type: 'string', enum: ['subscription', 'non_consumable', 'consumable'] },
    store_identifiers: { 
      type: 'object',
      additionalProperties: { type: 'string', minLength: 1 },
      nullable: true
    }
  },
  required: ['project_id', 'identifier', 'name', 'type'],
  additionalProperties: false
};

export const UpdateProductSchema = {
  type: 'object',
  properties: {
    project_id: { type: 'string', minLength: 1 },
    id: { type: 'string', minLength: 1 },
    identifier: { type: 'string', minLength: 1, nullable: true },
    name: { type: 'string', minLength: 1, nullable: true },
    description: { type: 'string', nullable: true },
    type: { type: 'string', enum: ['subscription', 'non_consumable', 'consumable'], nullable: true },
    store_identifiers: { 
      type: 'object',
      additionalProperties: { type: 'string', minLength: 1 },
      nullable: true
    }
  },
  required: ['project_id', 'id'],
  additionalProperties: false
};

// PACKAGE SCHEMAS
export const CreatePackageSchema = {
  type: 'object',
  properties: {
    identifier: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1 },
    position: { type: 'number', minimum: 0, nullable: true },
    product_identifiers: { 
      type: 'array', 
      items: { type: 'string', minLength: 1 },
      nullable: true 
    }
  },
  required: ['identifier', 'name'],
  additionalProperties: false
};

export const UpdatePackageSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
    identifier: { type: 'string', minLength: 1, nullable: true },
    name: { type: 'string', minLength: 1, nullable: true },
    position: { type: 'number', minimum: 0, nullable: true },
    product_identifiers: { 
      type: 'array', 
      items: { type: 'string', minLength: 1 },
      nullable: true 
    }
  },
  required: ['id'],
  additionalProperties: false
};

// PRICE EXPERIMENT SCHEMAS
export const CreatePriceExperimentSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', nullable: true },
    status: { type: 'string', enum: ['active', 'inactive', 'completed'], nullable: true },
    treatment_group_percentage: { type: 'number', minimum: 0, maximum: 100 }
  },
  required: ['name', 'treatment_group_percentage'],
  additionalProperties: false
};

export const UpdatePriceExperimentSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1, nullable: true },
    description: { type: 'string', nullable: true },
    status: { type: 'string', enum: ['active', 'inactive', 'completed'], nullable: true },
    treatment_group_percentage: { type: 'number', minimum: 0, maximum: 100, nullable: true }
  },
  required: ['id'],
  additionalProperties: false
};

// Schema registry for easy lookup by tool name
export const VALIDATION_SCHEMAS = {
  // Offering schemas
  CreateOffering: CreateOfferingSchema,
  GetOffering: ProjectIdParamSchema,
  UpdateOffering: UpdateOfferingSchema,
  DeleteOffering: ProjectIdParamSchema,
  ListOfferings: ProjectCursorParamSchema,
  
  // Entitlement schemas
  CreateEntitlement: CreateEntitlementSchema,
  GetEntitlement: IdParamSchema,
  UpdateEntitlement: UpdateEntitlementSchema,
  DeleteEntitlement: IdParamSchema,
  ListEntitlements: CursorParamSchema,
  
  // Product schemas
  CreateProduct: CreateProductSchema,
  GetProduct: ProjectIdParamSchema,
  UpdateProduct: UpdateProductSchema,
  DeleteProduct: ProjectIdParamSchema,
  ListProducts: ProjectCursorParamSchema,
  
  // Package schemas
  CreatePackage: CreatePackageSchema,
  GetPackage: IdParamSchema,
  UpdatePackage: UpdatePackageSchema,
  DeletePackage: IdParamSchema,
  ListPackages: CursorParamSchema,
  
  // Price Experiment schemas
  CreatePriceExperiment: CreatePriceExperimentSchema,
  GetPriceExperiment: IdParamSchema,
  UpdatePriceExperiment: UpdatePriceExperimentSchema,
  DeletePriceExperiment: IdParamSchema,
  ListPriceExperiments: CursorParamSchema
} as const;

export type ToolName = keyof typeof VALIDATION_SCHEMAS;