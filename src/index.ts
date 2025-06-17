#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMCPServer } from './presentation/mcp-server.js';
import { loadConfig } from './core/config.js';
import { createLogger } from './infrastructure/logger.js';

async function main() {
  try {
    const config = loadConfig();
    const logger = createLogger();
    const server = createMCPServer(config, logger);
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    logger.info('MCP RevenueCat server started');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch(console.error);