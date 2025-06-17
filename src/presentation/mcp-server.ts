import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Config } from '../core/config.js';
import { Logger } from 'pino';
import { RevenueCatClient } from '../infrastructure/revenuecat-client.js';
import { mapHttpErrorToMcp } from '../core/errors/error-mapper.js';
import { CreateOfferingUseCase } from '../core/use-cases/offering/create-offering.js';
import { GetOfferingUseCase } from '../core/use-cases/offering/get-offering.js';
import { UpdateOfferingUseCase } from '../core/use-cases/offering/update-offering.js';
import { DeleteOfferingUseCase } from '../core/use-cases/offering/delete-offering.js';
import { ListOfferingsUseCase } from '../core/use-cases/offering/list-offerings.js';
import { CreateEntitlementUseCase } from '../core/use-cases/entitlement/create-entitlement.js';
import { GetEntitlementUseCase } from '../core/use-cases/entitlement/get-entitlement.js';
import { UpdateEntitlementUseCase } from '../core/use-cases/entitlement/update-entitlement.js';
import { DeleteEntitlementUseCase } from '../core/use-cases/entitlement/delete-entitlement.js';
import { ListEntitlementsUseCase } from '../core/use-cases/entitlement/list-entitlements.js';
import { CreateProductUseCase } from '../core/use-cases/product/create-product.js';
import { GetProductUseCase } from '../core/use-cases/product/get-product.js';
import { UpdateProductUseCase } from '../core/use-cases/product/update-product.js';
import { DeleteProductUseCase } from '../core/use-cases/product/delete-product.js';
import { ListProductsUseCase } from '../core/use-cases/product/list-products.js';
import { CreatePackageUseCase } from '../core/use-cases/package/create-package.js';
import { GetPackageUseCase } from '../core/use-cases/package/get-package.js';
import { UpdatePackageUseCase } from '../core/use-cases/package/update-package.js';
import { DeletePackageUseCase } from '../core/use-cases/package/delete-package.js';
import { ListPackagesUseCase } from '../core/use-cases/package/list-packages.js';
import { CreatePriceExperimentUseCase } from '../core/use-cases/price-experiment/create-price-experiment.js';
import { GetPriceExperimentUseCase } from '../core/use-cases/price-experiment/get-price-experiment.js';
import { UpdatePriceExperimentUseCase } from '../core/use-cases/price-experiment/update-price-experiment.js';
import { DeletePriceExperimentUseCase } from '../core/use-cases/price-experiment/delete-price-experiment.js';
import { ListPriceExperimentsUseCase } from '../core/use-cases/price-experiment/list-price-experiments.js';
import { CreateOfferingRequest, UpdateOfferingRequest } from '../core/entities/offering.js';
import { CreateEntitlementRequest, UpdateEntitlementRequest } from '../core/entities/entitlement.js';
import { CreateProductRequest, UpdateProductRequest } from '../core/entities/product.js';
import { CreatePackageRequest, UpdatePackageRequest } from '../core/entities/package.js';
import { CreatePriceExperimentRequest, UpdatePriceExperimentRequest } from '../core/entities/price-experiment.js';

export function createMCPServer(config: Config, logger: Logger): Server {
  // Create RevenueCat client
  const revenueCatClient = new RevenueCatClient(config, logger);
  
  // Create use case instances
  const createOfferingUseCase = new CreateOfferingUseCase(revenueCatClient);
  const getOfferingUseCase = new GetOfferingUseCase(revenueCatClient);
  const updateOfferingUseCase = new UpdateOfferingUseCase(revenueCatClient);
  const deleteOfferingUseCase = new DeleteOfferingUseCase(revenueCatClient);
  const listOfferingsUseCase = new ListOfferingsUseCase(revenueCatClient);
  
  const createEntitlementUseCase = new CreateEntitlementUseCase(revenueCatClient);
  const getEntitlementUseCase = new GetEntitlementUseCase(revenueCatClient);
  const updateEntitlementUseCase = new UpdateEntitlementUseCase(revenueCatClient);
  const deleteEntitlementUseCase = new DeleteEntitlementUseCase(revenueCatClient);
  const listEntitlementsUseCase = new ListEntitlementsUseCase(revenueCatClient);
  
  const createProductUseCase = new CreateProductUseCase(revenueCatClient);
  const getProductUseCase = new GetProductUseCase(revenueCatClient);
  const updateProductUseCase = new UpdateProductUseCase(revenueCatClient);
  const deleteProductUseCase = new DeleteProductUseCase(revenueCatClient);
  const listProductsUseCase = new ListProductsUseCase(revenueCatClient);
  
  const createPackageUseCase = new CreatePackageUseCase(revenueCatClient);
  const getPackageUseCase = new GetPackageUseCase(revenueCatClient);
  const updatePackageUseCase = new UpdatePackageUseCase(revenueCatClient);
  const deletePackageUseCase = new DeletePackageUseCase(revenueCatClient);
  const listPackagesUseCase = new ListPackagesUseCase(revenueCatClient);
  
  const createPriceExperimentUseCase = new CreatePriceExperimentUseCase(revenueCatClient);
  const getPriceExperimentUseCase = new GetPriceExperimentUseCase(revenueCatClient);
  const updatePriceExperimentUseCase = new UpdatePriceExperimentUseCase(revenueCatClient);
  const deletePriceExperimentUseCase = new DeletePriceExperimentUseCase(revenueCatClient);
  const listPriceExperimentsUseCase = new ListPriceExperimentsUseCase(revenueCatClient);

  const server = new Server(
    {
      name: 'revenuecat-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {
          CreateOffering: {
            description: 'Create a new offering',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Name of the offering' },
                description: { type: 'string', description: 'Description of the offering' },
                is_default: { type: 'boolean', description: 'Whether this is the default offering' },
                packages: { type: 'array', items: { type: 'string' }, description: 'Package IDs to include' }
              },
              required: ['name']
            }
          },
          GetOffering: {
            description: 'Get an offering by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The offering ID' }
              },
              required: ['id']
            }
          },
          UpdateOffering: {
            description: 'Update an existing offering',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The offering ID' },
                name: { type: 'string', description: 'Name of the offering' },
                description: { type: 'string', description: 'Description of the offering' },
                is_default: { type: 'boolean', description: 'Whether this is the default offering' },
                packages: { type: 'array', items: { type: 'string' }, description: 'Package IDs to include' }
              },
              required: ['id']
            }
          },
          DeleteOffering: {
            description: 'Delete an offering by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The offering ID' }
              },
              required: ['id']
            }
          },
          ListOfferings: {
            description: 'List all offerings with optional pagination',
            inputSchema: {
              type: 'object',
              properties: {
                cursor: { type: 'string', description: 'Pagination cursor for next page' }
              },
              required: []
            }
          },
          CreateEntitlement: {
            description: 'Create a new entitlement',
            inputSchema: {
              type: 'object',
              properties: {
                identifier: { type: 'string', description: 'Unique identifier for the entitlement' },
                name: { type: 'string', description: 'Name of the entitlement' },
                description: { type: 'string', description: 'Description of the entitlement' },
                product_identifiers: { type: 'array', items: { type: 'string' }, description: 'Product identifiers' }
              },
              required: ['identifier', 'name']
            }
          },
          GetEntitlement: {
            description: 'Get an entitlement by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The entitlement ID' }
              },
              required: ['id']
            }
          },
          UpdateEntitlement: {
            description: 'Update an existing entitlement',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The entitlement ID' },
                identifier: { type: 'string', description: 'Unique identifier for the entitlement' },
                name: { type: 'string', description: 'Name of the entitlement' },
                description: { type: 'string', description: 'Description of the entitlement' },
                product_identifiers: { type: 'array', items: { type: 'string' }, description: 'Product identifiers' }
              },
              required: ['id']
            }
          },
          DeleteEntitlement: {
            description: 'Delete an entitlement by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The entitlement ID' }
              },
              required: ['id']
            }
          },
          ListEntitlements: {
            description: 'List all entitlements with optional pagination',
            inputSchema: {
              type: 'object',
              properties: {
                cursor: { type: 'string', description: 'Pagination cursor for next page' }
              },
              required: []
            }
          },
          CreateProduct: {
            description: 'Create a new product',
            inputSchema: {
              type: 'object',
              properties: {
                identifier: { type: 'string', description: 'Unique identifier for the product' },
                name: { type: 'string', description: 'Name of the product' },
                description: { type: 'string', description: 'Description of the product' },
                type: { type: 'string', enum: ['subscription', 'non_consumable', 'consumable'], description: 'Product type' },
                store_identifiers: { type: 'object', description: 'Store-specific identifiers' }
              },
              required: ['identifier', 'name', 'type']
            }
          },
          GetProduct: {
            description: 'Get a product by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The product ID' }
              },
              required: ['id']
            }
          },
          UpdateProduct: {
            description: 'Update an existing product',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The product ID' },
                identifier: { type: 'string', description: 'Unique identifier for the product' },
                name: { type: 'string', description: 'Name of the product' },
                description: { type: 'string', description: 'Description of the product' },
                type: { type: 'string', enum: ['subscription', 'non_consumable', 'consumable'], description: 'Product type' },
                store_identifiers: { type: 'object', description: 'Store-specific identifiers' }
              },
              required: ['id']
            }
          },
          DeleteProduct: {
            description: 'Delete a product by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The product ID' }
              },
              required: ['id']
            }
          },
          ListProducts: {
            description: 'List all products with optional pagination',
            inputSchema: {
              type: 'object',
              properties: {
                cursor: { type: 'string', description: 'Pagination cursor for next page' }
              },
              required: []
            }
          },
          CreatePackage: {
            description: 'Create a new package',
            inputSchema: {
              type: 'object',
              properties: {
                identifier: { type: 'string', description: 'Unique identifier for the package' },
                name: { type: 'string', description: 'Name of the package' },
                position: { type: 'number', description: 'Position of the package' },
                product_identifiers: { type: 'array', items: { type: 'string' }, description: 'Product identifiers' }
              },
              required: ['identifier', 'name']
            }
          },
          GetPackage: {
            description: 'Get a package by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The package ID' }
              },
              required: ['id']
            }
          },
          UpdatePackage: {
            description: 'Update an existing package',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The package ID' },
                identifier: { type: 'string', description: 'Unique identifier for the package' },
                name: { type: 'string', description: 'Name of the package' },
                position: { type: 'number', description: 'Position of the package' },
                product_identifiers: { type: 'array', items: { type: 'string' }, description: 'Product identifiers' }
              },
              required: ['id']
            }
          },
          DeletePackage: {
            description: 'Delete a package by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The package ID' }
              },
              required: ['id']
            }
          },
          ListPackages: {
            description: 'List all packages with optional pagination',
            inputSchema: {
              type: 'object',
              properties: {
                cursor: { type: 'string', description: 'Pagination cursor for next page' }
              },
              required: []
            }
          },
          CreatePriceExperiment: {
            description: 'Create a new price experiment',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Name of the price experiment' },
                description: { type: 'string', description: 'Description of the price experiment' },
                status: { type: 'string', enum: ['active', 'inactive', 'completed'], description: 'Status of the experiment' },
                treatment_group_percentage: { type: 'number', description: 'Treatment group percentage' }
              },
              required: ['name', 'treatment_group_percentage']
            }
          },
          GetPriceExperiment: {
            description: 'Get a price experiment by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The price experiment ID' }
              },
              required: ['id']
            }
          },
          UpdatePriceExperiment: {
            description: 'Update an existing price experiment',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The price experiment ID' },
                name: { type: 'string', description: 'Name of the price experiment' },
                description: { type: 'string', description: 'Description of the price experiment' },
                status: { type: 'string', enum: ['active', 'inactive', 'completed'], description: 'Status of the experiment' },
                treatment_group_percentage: { type: 'number', description: 'Treatment group percentage' }
              },
              required: ['id']
            }
          },
          DeletePriceExperiment: {
            description: 'Delete a price experiment by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The price experiment ID' }
              },
              required: ['id']
            }
          },
          ListPriceExperiments: {
            description: 'List all price experiments with optional pagination',
            inputSchema: {
              type: 'object',
              properties: {
                cursor: { type: 'string', description: 'Pagination cursor for next page' }
              },
              required: []
            }
          }
        },
      },
    }
  );

  // Register tool handlers
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    logger.info({ tool: name, args }, 'Tool called');
    
    // Ensure args exists and is an object
    if (!args || typeof args !== 'object') {
      throw new Error('Invalid arguments provided');
    }
    
    try {
      // Route to appropriate use case based on tool name
      switch (name) {
        case 'CreateOffering': {
          const request: CreateOfferingRequest = {
            name: (args as any).name as string,
            description: (args as any).description as string | undefined,
            is_default: (args as any).is_default as boolean | undefined,
            packages: (args as any).packages as string[] | undefined
          };
          const result = await createOfferingUseCase.execute(request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'GetOffering': {
          const result = await getOfferingUseCase.execute((args as any).id as string);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'UpdateOffering': {
          const request: UpdateOfferingRequest = {
            name: (args as any).name as string | undefined,
            description: (args as any).description as string | undefined,
            is_default: (args as any).is_default as boolean | undefined,
            packages: (args as any).packages as string[] | undefined
          };
          const result = await updateOfferingUseCase.execute((args as any).id as string, request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'DeleteOffering': {
          const id = (args as any).id as string;
          await deleteOfferingUseCase.execute(id);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ success: true, message: `Offering ${id} deleted successfully` }, null, 2)
              }
            ]
          };
        }
        
        case 'ListOfferings': {
          const result = await listOfferingsUseCase.execute((args as any).cursor as string | undefined);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'CreateEntitlement': {
          const request: CreateEntitlementRequest = {
            identifier: (args as any).identifier as string,
            name: (args as any).name as string,
            description: (args as any).description as string | undefined,
            product_identifiers: (args as any).product_identifiers as string[] | undefined
          };
          const result = await createEntitlementUseCase.execute(request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'GetEntitlement': {
          const result = await getEntitlementUseCase.execute((args as any).id as string);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'UpdateEntitlement': {
          const request: UpdateEntitlementRequest = {
            identifier: (args as any).identifier as string | undefined,
            name: (args as any).name as string | undefined,
            description: (args as any).description as string | undefined,
            product_identifiers: (args as any).product_identifiers as string[] | undefined
          };
          const result = await updateEntitlementUseCase.execute((args as any).id as string, request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'DeleteEntitlement': {
          const id = (args as any).id as string;
          await deleteEntitlementUseCase.execute(id);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ success: true, message: `Entitlement ${id} deleted successfully` }, null, 2)
              }
            ]
          };
        }
        
        case 'ListEntitlements': {
          const result = await listEntitlementsUseCase.execute((args as any).cursor as string | undefined);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'CreateProduct': {
          const request: CreateProductRequest = {
            identifier: (args as any).identifier as string,
            name: (args as any).name as string,
            description: (args as any).description as string | undefined,
            type: (args as any).type as 'subscription' | 'non_consumable' | 'consumable',
            store_identifiers: (args as any).store_identifiers as { [store: string]: string } | undefined
          };
          const result = await createProductUseCase.execute(request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'GetProduct': {
          const result = await getProductUseCase.execute((args as any).id as string);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'UpdateProduct': {
          const request: UpdateProductRequest = {
            identifier: (args as any).identifier as string | undefined,
            name: (args as any).name as string | undefined,
            description: (args as any).description as string | undefined,
            type: (args as any).type as 'subscription' | 'non_consumable' | 'consumable' | undefined,
            store_identifiers: (args as any).store_identifiers as { [store: string]: string } | undefined
          };
          const result = await updateProductUseCase.execute((args as any).id as string, request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'DeleteProduct': {
          const id = (args as any).id as string;
          await deleteProductUseCase.execute(id);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ success: true, message: `Product ${id} deleted successfully` }, null, 2)
              }
            ]
          };
        }
        
        case 'ListProducts': {
          const result = await listProductsUseCase.execute((args as any).cursor as string | undefined);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'CreatePackage': {
          const request: CreatePackageRequest = {
            identifier: (args as any).identifier as string,
            name: (args as any).name as string,
            position: (args as any).position as number | undefined,
            product_identifiers: (args as any).product_identifiers as string[] | undefined
          };
          const result = await createPackageUseCase.execute(request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'GetPackage': {
          const result = await getPackageUseCase.execute((args as any).id as string);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'UpdatePackage': {
          const request: UpdatePackageRequest = {
            identifier: (args as any).identifier as string | undefined,
            name: (args as any).name as string | undefined,
            position: (args as any).position as number | undefined,
            product_identifiers: (args as any).product_identifiers as string[] | undefined
          };
          const result = await updatePackageUseCase.execute((args as any).id as string, request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'DeletePackage': {
          const id = (args as any).id as string;
          await deletePackageUseCase.execute(id);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ success: true, message: `Package ${id} deleted successfully` }, null, 2)
              }
            ]
          };
        }
        
        case 'ListPackages': {
          const result = await listPackagesUseCase.execute((args as any).cursor as string | undefined);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'CreatePriceExperiment': {
          const request: CreatePriceExperimentRequest = {
            name: (args as any).name as string,
            description: (args as any).description as string | undefined,
            status: (args as any).status as 'active' | 'inactive' | 'completed' | undefined,
            treatment_group_percentage: (args as any).treatment_group_percentage as number
          };
          const result = await createPriceExperimentUseCase.execute(request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'GetPriceExperiment': {
          const result = await getPriceExperimentUseCase.execute((args as any).id as string);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'UpdatePriceExperiment': {
          const request: UpdatePriceExperimentRequest = {
            name: (args as any).name as string | undefined,
            description: (args as any).description as string | undefined,
            status: (args as any).status as 'active' | 'inactive' | 'completed' | undefined,
            treatment_group_percentage: (args as any).treatment_group_percentage as number | undefined
          };
          const result = await updatePriceExperimentUseCase.execute((args as any).id as string, request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        case 'DeletePriceExperiment': {
          const id = (args as any).id as string;
          await deletePriceExperimentUseCase.execute(id);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ success: true, message: `PriceExperiment ${id} deleted successfully` }, null, 2)
              }
            ]
          };
        }
        
        case 'ListPriceExperiments': {
          const result = await listPriceExperimentsUseCase.execute((args as any).cursor as string | undefined);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      logger.error({ error: 'Tool execution failed', tool: name }, 'Tool execution failed');
      throw mapHttpErrorToMcp(error);
    }
  });

  return server;
}