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
import { CreateOfferingRequest, UpdateOfferingRequest } from '../core/entities/offering.js';

export function createMCPServer(config: Config, logger: Logger): Server {
  // Create RevenueCat client
  const revenueCatClient = new RevenueCatClient(config, logger);
  
  // Create use case instances
  const createOfferingUseCase = new CreateOfferingUseCase(revenueCatClient);
  const getOfferingUseCase = new GetOfferingUseCase(revenueCatClient);
  const updateOfferingUseCase = new UpdateOfferingUseCase(revenueCatClient);
  const deleteOfferingUseCase = new DeleteOfferingUseCase(revenueCatClient);
  const listOfferingsUseCase = new ListOfferingsUseCase(revenueCatClient);

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