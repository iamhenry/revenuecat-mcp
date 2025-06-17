# MCP RevenueCat Wrapper - Development Guide

## Project Overview

Build a Model Context Protocol (MCP) server that exposes the complete RevenueCat v2 REST API as MCP tools for IDE integration (VS Code, Cursor, etc.).

### Key Requirements
- **Complete API Coverage**: All 5 RevenueCat resources with full CRUD operations (25 MCP commands)
- **Easy IDE Integration**: npm installable package that IDEs can launch
- **Clean Architecture**: Maintainable, extensible codebase
- **Cross-platform**: Works on macOS, Linux, Windows

## Architecture Overview

```
┌──────────────┐    MCP JSON     ┌─────────────────┐
│ IDE (Cursor) │ ────────────► │ MCP Server      │
│              │               │ (Entry Point)   │
└──────────────┘               └─────────┬───────┘
                                         │
                               ┌─────────▼───────┐
                               │ Presentation    │
                               │ Layer           │
                               └─────────┬───────┘
                                         │
                               ┌─────────▼───────┐
                               │ Core/Use Cases  │
                               │ Layer           │
                               └─────────┬───────┘
                                         │
                               ┌─────────▼───────┐
                               │ Infrastructure  │
                               │ (RevenueCat)    │
                               └─────────────────┘
```

## File Structure

```
src/
├── index.ts                    # MCP server entry point
├── core/
│   ├── config.ts              # Environment configuration
│   ├── entities/              # Domain entities
│   │   ├── offering.ts
│   │   ├── entitlement.ts
│   │   ├── product.ts
│   │   ├── package.ts
│   │   └── price-experiment.ts
│   ├── use-cases/             # Business logic
│   │   ├── offering/
│   │   │   ├── create-offering.ts
│   │   │   ├── get-offering.ts
│   │   │   ├── update-offering.ts
│   │   │   ├── delete-offering.ts
│   │   │   └── list-offerings.ts
│   │   └── [similar for other resources]
│   └── errors/
│       └── error-mapper.ts    # HTTP to MCP error mapping
├── infrastructure/
│   ├── revenuecat-client.ts   # HTTP client for RevenueCat API
│   └── logger.ts              # Structured logging
└── presentation/
    └── mcp-server.ts          # MCP protocol handler
```

## Development Phases

### PHASE 0: Project Setup (Week 1)

#### Task 0.1: Initialize Package Configuration
- Create `package.json` with:
  - Project metadata (name, version, description)
  - Bin entry: `"revenuecat-mcp": "./dist/index.js"`
  - Dependencies and devDependencies
  - Build and publish scripts

```json
{
  "name": "@yourorg/revenuecat-mcp",
  "version": "1.0.0",
  "description": "MCP server for RevenueCat API integration",
  "bin": {
    "revenuecat-mcp": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc && esbuild dist/index.js --bundle --platform=node --outfile=dist/bundle.js",
    "dev": "ts-node src/index.ts",
    "prepublishOnly": "npm run build"
  }
}
```

#### Task 0.2: Install Dependencies
```bash
npm install @modelcontextprotocol/sdk
npm install pino dotenv-safe
npm install -D typescript @types/node ts-node esbuild
```

#### Task 0.3: Configure TypeScript
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./src",
    "paths": {
      "@core/*": ["core/*"],
      "@infrastructure/*": ["infrastructure/*"],
      "@presentation/*": ["presentation/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Task 0.4: Create Project Files
- `.gitignore`: Standard Node.js gitignore
- `.env.example`:
```
REVENUECAT_SECRET_KEY=your_secret_key_here
RC_API_URL=https://api.revenuecat.com/v2
```

#### Task 0.5: Create Directory Structure
```bash
mkdir -p src/{core/{entities,use-cases,errors},infrastructure,presentation}
mkdir -p src/core/use-cases/{offering,entitlement,product,package,price-experiment}
```

### PHASE 1: Core Infrastructure (Week 1-2)

#### Task 1.1: Create MCP Server Entry Point
`src/index.ts`:
```typescript
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
```

#### Task 1.2: Implement MCP Server
`src/presentation/mcp-server.ts`:
```typescript
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
          break;
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
```

#### Task 1.3: Environment Configuration
`src/core/config.ts`:
```typescript
import { config as dotenvConfig } from 'dotenv-safe';

export interface Config {
  revenueCatSecretKey: string;
  revenueCatApiUrl: string;
  logLevel: string;
}

export function loadConfig(): Config {
  dotenvConfig({
    allowEmptyValues: false,
    example: '.env.example'
  });

  return {
    revenueCatSecretKey: process.env.REVENUECAT_SECRET_KEY!,
    revenueCatApiUrl: process.env.RC_API_URL || 'https://api.revenuecat.com/v2',
    logLevel: process.env.LOG_LEVEL || 'info'
  };
}
```

#### Task 1.4: RevenueCat HTTP Client
`src/infrastructure/revenuecat-client.ts`:
```typescript
import { Config } from '../core/config.js';
import { Logger } from 'pino';

export class RevenueCatClient {
  constructor(
    private config: Config,
    private logger: Logger
  ) {}

  async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    endpoint: string,
    body?: any
  ): Promise<T> {
    const url = `${this.config.revenueCatApiUrl}${endpoint}`;
    const requestId = crypto.randomUUID();
    
    this.logger.info({ requestId, method, url }, 'HTTP request started');
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${this.config.revenueCatSecretKey}`,
        'Content-Type': 'application/json',
        'X-Request-ID': requestId
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error({ requestId, status: response.status, error }, 'HTTP request failed');
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const data = await response.json();
    this.logger.info({ requestId }, 'HTTP request completed');
    return data;
  }
}
```

#### Task 1.5: Structured Logger
`src/infrastructure/logger.ts`:
```typescript
import pino from 'pino';
import { Config } from '../core/config.js';

export function createLogger(config?: Config) {
  return pino({
    level: config?.logLevel || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: ['config.revenueCatSecretKey', '*.secret*', '*.token*']
  });
}
```

#### Task 1.6: Error Mapping
`src/core/errors/error-mapper.ts`:
```typescript
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export function mapHttpErrorToMcp(error: any): McpError {
  if (error.message?.includes('HTTP 400')) {
    return new McpError(ErrorCode.InvalidParams, 'Validation error', error.message);
  }
  if (error.message?.includes('HTTP 401')) {
    return new McpError(ErrorCode.InvalidRequest, 'Unauthenticated');
  }
  if (error.message?.includes('HTTP 403')) {
    return new McpError(ErrorCode.InvalidRequest, 'Forbidden');
  }
  if (error.message?.includes('HTTP 404')) {
    return new McpError(ErrorCode.InvalidParams, 'Not found');
  }
  if (error.message?.includes('HTTP 429')) {
    return new McpError(ErrorCode.InvalidRequest, 'Rate limited');
  }
  
  return new McpError(ErrorCode.InternalError, 'Internal server error');
}
```

### PHASE 2: Offerings Resource (Week 2)

#### Task 2.1: Define Offering Entities
`src/core/entities/offering.ts`:
```typescript
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
```

#### Task 2.2: Implement Offering Use Cases
Create files in `src/core/use-cases/offering/`:

`create-offering.ts`:
```typescript
import { RevenueCatClient } from '../../../infrastructure/revenuecat-client.js';
import { CreateOfferingRequest, Offering } from '../../entities/offering.js';

export class CreateOfferingUseCase {
  constructor(private client: RevenueCatClient) {}

  async execute(request: CreateOfferingRequest): Promise<Offering> {
    return this.client.request<Offering>('POST', '/offerings', request);
  }
}
```

Similar pattern for `get-offering.ts`, `update-offering.ts`, `delete-offering.ts`, `list-offerings.ts`.

#### Task 2.3: Register Offering MCP Tools
Update `src/presentation/mcp-server.ts` to register tools and handle Offering operations.

### PHASE 3: Remaining Resources (Week 3-4)

#### Tasks 3.1-3.12: Complete All Resources
Follow the same pattern as Offerings for:
- Entitlement (Tasks 3.1-3.3)
- Product (Tasks 3.4-3.6) 
- Package (Tasks 3.7-3.9)
- PriceExperiment (Tasks 3.10-3.12)

Each resource needs:
1. Entity definitions in `src/core/entities/`
2. Use case implementations in `src/core/use-cases/[resource]/`
3. MCP tool registration in `src/presentation/mcp-server.ts`

### PHASE 4: Robustness (Week 4-5)

#### Task 4.1: Add Retry Logic
Enhance `RevenueCatClient` with exponential backoff:
```typescript
async retry<T>(operation: () => Promise<T>, maxAttempts = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const delay = Math.min(200 * Math.pow(2, attempt - 1), 2000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max attempts exceeded');
}
```

#### Task 4.2: Implement Pagination
Add pagination support to List operations with cursor-based navigation.

#### Task 4.3: Input Validation
Add JSON schema validation for all MCP tool inputs.

### PHASE 5: Packaging (Week 5)

#### Task 5.1: Configure esbuild
Create `esbuild.config.js`:
```javascript
import { build } from 'esbuild';

await build({
  entryPoints: ['dist/index.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/bundle.js',
  external: []
});
```

#### Task 5.2: Add Build Scripts
Update `package.json` scripts for building and publishing.

#### Task 5.3: Test Installation
```bash
npm pack
npm install -g ./revenuecat-mcp-1.0.0.tgz
revenuecat-mcp --version
```

#### Task 5.4: Verify Bundle Size
Ensure the bundled executable is under 5MB.

### PHASE 6: Polish (Week 6)

#### Tasks 6.1-6.6: Final Touches
- Add verbose logging flag
- Implement request tracking
- Add TSDoc documentation
- Write comprehensive README
- Security audit
- Prepare v1.0 release

## Testing Strategy

Since you'll be doing manual testing:

1. **IDE Integration Test**: Add the MCP server to Cursor/VS Code and verify all 25 commands work
2. **Error Handling Test**: Test with invalid API keys, malformed requests
3. **Pagination Test**: Verify List operations handle large datasets correctly
4. **Cross-platform Test**: Verify npm installation works on different operating systems

## Success Criteria

- [ ] All 25 MCP commands (5 resources × 5 operations) function correctly
- [ ] npm installation works: `npm install -g @yourorg/revenuecat-mcp`
- [ ] IDE integration works seamlessly with Cursor/VS Code
- [ ] Bundle size under 5MB
- [ ] No secrets leaked in logs
- [ ] README enables 5-minute quick start

## Timeline

| Week | Phase | Deliverable |
|------|-------|-------------|
| 1 | 0-1 | Project setup + Core infrastructure |
| 2 | 2 | Offerings CRUD working |
| 3-4 | 3 | All resources implemented |
| 5 | 4-5 | Robustness + Packaging |
| 6 | 6 | Polish + Release |

---

## FUTURE ROADMAP - PRODUCT BACKLOG

### V2: OPENAPI GENERALIZATION MVP

**Vision**: Transform the current RevenueCat-specific MCP server into a generic OpenAPI-powered MCP server that can work with any REST API that provides OpenAPI specifications.

#### Epic 1: Core OpenAPI Parser Engine
- **Story 1.1**: Replace hardcoded RevenueCat entities with dynamic OpenAPI schema parsing
- **Story 1.2**: Auto-generate MCP tools from OpenAPI paths and operations
- **Story 1.3**: Dynamic validation using OpenAPI schemas instead of custom validation
- **Story 1.4**: Generic authentication support (Bearer, API Key, Basic Auth)

#### Epic 2: Configuration System
- **Story 2.1**: Create OpenAPI MCP configuration interface (`specUrl`, `authConfig`, `baseUrl`)
- **Story 2.2**: Support multiple specification formats (URL, local file, embedded)
- **Story 2.3**: Environment variable mapping for authentication
- **Story 2.4**: Project/tenant context support for multi-tenant APIs

#### Epic 3: Architecture Generalization
- **Story 3.1**: Refactor RevenueCatClient to GenericApiClient
- **Story 3.2**: Abstract use cases to work with any OpenAPI specification
- **Story 3.3**: Dynamic MCP tool registration based on parsed specifications
- **Story 3.4**: Maintain clean architecture layers while adding generalization

#### Epic 4: CLI Experience
- **Story 4.1**: Command-line interface: `openapi-mcp --spec URL --auth TYPE:VAR`
- **Story 4.2**: Interactive setup wizard for new APIs
- **Story 4.3**: Configuration validation and testing
- **Story 4.4**: Multiple API support in single server instance

#### Epic 5: MVP Validation
- **Story 5.1**: Support 5-10 major APIs with existing OpenAPI specs (Stripe, GitHub, Twilio)
- **Story 5.2**: Maintain backward compatibility with RevenueCat
- **Story 5.3**: Performance benchmarking vs current implementation
- **Story 5.4**: Community feedback and iteration

### V3: HYBRID ARCHITECTURE

**Vision**: Combine OpenAPI automation with plugin extensibility for complex business logic and custom integrations.

#### Epic 6: Plugin Framework
- **Story 6.1**: Design plugin interface for custom business logic
- **Story 6.2**: Plugin lifecycle management (load, initialize, destroy)
- **Story 6.3**: Plugin marketplace and distribution strategy
- **Story 6.4**: Plugin development toolkit and documentation

#### Epic 7: Advanced Features
- **Story 7.1**: Complex authentication flows (OAuth2, JWT refresh)
- **Story 7.2**: File upload/download support
- **Story 7.3**: Webhook handling and event streaming
- **Story 7.4**: Custom request/response transformations

### V4: ENTERPRISE FEATURES

**Vision**: Production-ready features for enterprise adoption and large-scale deployments.

#### Epic 8: Production Readiness
- **Story 8.1**: Multi-tenancy and isolation
- **Story 8.2**: Rate limiting and quota management  
- **Story 8.3**: Monitoring, metrics, and observability
- **Story 8.4**: High availability and clustering

#### Epic 9: Security & Compliance
- **Story 9.1**: API key rotation and management
- **Story 9.2**: Audit logging and compliance reporting
- **Story 9.3**: Secret management integration (HashiCorp Vault, AWS Secrets)
- **Story 9.4**: Security scanning and vulnerability management

### RESEARCH INITIATIVES

#### Research 1: Protocol Extensions
- GraphQL support for APIs beyond REST
- Protocol Buffers/gRPC integration
- WebSocket and real-time API support

#### Research 2: AI-Powered Features
- Automatic API discovery and documentation
- Intelligent error handling and recovery
- Usage pattern optimization

#### Research 3: Developer Experience
- IDE plugin development (VS Code extension)
- Visual API explorer and testing interface
- Automated integration testing framework

### SUCCESS METRICS BY VERSION

**V2 OpenAPI MVP**:
- Support 10+ major APIs via OpenAPI specs
- <30 second setup time for new APIs
- Community adoption (GitHub stars, npm downloads)
- Performance parity with V1

**V3 Hybrid Architecture**:
- 3+ community-contributed plugins
- Enterprise pilot customers
- 99.9% uptime in production deployments

**V4 Enterprise**:
- Fortune 500 customer adoption
- Multi-region deployment capability
- SOC2/ISO27001 compliance ready

---

*This guide provides a complete roadmap for building the MCP RevenueCat wrapper and its future evolution into a comprehensive API integration platform. Follow the phases sequentially, and you'll have a production-ready MCP server that integrates seamlessly with modern IDEs.*