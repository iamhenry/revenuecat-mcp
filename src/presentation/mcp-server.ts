import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Config } from '../core/config.js';
import { Logger } from 'pino';

export function createMCPServer(config: Config, logger: Logger): Server {
  const server = new Server(
    {
      name: 'revenuecat-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tool handlers
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    logger.info({ tool: name, args }, 'Tool called');
    
    try {
      // Route to appropriate use case based on tool name
      switch (name) {
        case 'CreateOffering':
          // TODO: Implement in Phase 2
          return {
            content: [
              {
                type: 'text',
                text: 'CreateOffering tool not yet implemented - coming in Phase 2'
              }
            ]
          };
        // Add other tools...
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      logger.error({ error, tool: name }, 'Tool execution failed');
      throw error;
    }
  });

  return server;
}