# MCP RevenueCat Wrapper - Project Context

## PROJECT OVERVIEW

This project builds an MCP (Model Context Protocol) server that exposes the complete RevenueCat v2 REST API as MCP tools for IDE integration. The goal is to enable AI agents, developers, and scripts to perform CRUD operations on RevenueCat resources directly within IDEs like VS Code and Cursor.

**KEY CONSTRAINT**: This is NOT a CLI tool - it's an MCP server executable designed for IDE integration via npm package installation.

## ARCHITECTURE

### Clean Architecture Layers
```
┌──────────────┐    MCP JSON     ┌─────────────────┐
│ IDE (Cursor) │ ────────────► │ MCP Server      │
│              │               │ (Entry Point)   │
└──────────────┘               └─────────┬───────┘
                                         │
                               ┌─────────▼───────┐
                               │ Presentation    │ ← MCP Protocol Handler
                               │ Layer           │
                               └─────────┬───────┘
                                         │
                               ┌─────────▼───────┐
                               │ Core/Use Cases  │ ← Business Logic
                               │ Layer           │
                               └─────────┬───────┘
                                         │
                               ┌─────────▼───────┐
                               │ Infrastructure  │ ← RevenueCat HTTP Client
                               │ Layer           │
                               └─────────────────┘
```

### Technology Stack
- **TypeScript**: Primary language with strict type checking
- **MCP SDK**: `@modelcontextprotocol/sdk` for protocol implementation
- **STDIO Transport**: Newline-delimited JSON communication (not HTTP/SSE)
- **Pino**: Structured JSON logging with secret redaction
- **esbuild**: Bundling for single executable under 5MB
- **dotenv-safe**: Environment variable management with fail-fast validation

## CORE REQUIREMENTS

### API Coverage
- **5 Resources**: Offering, Entitlement, Product, Package, PriceExperiment
- **5 Operations per Resource**: Create, Get, Update, Delete, List
- **Total**: 25 MCP commands with complete CRUD coverage

### Critical Constraints
- Bundle size MUST be under 5MB
- NO secrets in logs (use Pino redaction)
- Cross-platform compatibility (Node ≥18 on macOS, Linux, Windows)
- STDIO transport only (no HTTP/SSE server)
- Fail-fast if REVENUECAT_SECRET_KEY missing

### Error Handling
Map HTTP errors to MCP error codes:
- 400 → `VALIDATION_ERROR`
- 401 → `UNAUTHENTICATED`
- 403 → `FORBIDDEN`
- 404 → `NOT_FOUND`
- 429 → `RATE_LIMITED` (with retryAfter)
- 500+ → `INTERNAL`

## FILE STRUCTURE

```
src/
├── index.ts                    # MCP server entry point (#!/usr/bin/env node)
├── core/
│   ├── config.ts              # Environment configuration with dotenv-safe
│   ├── entities/              # TypeScript interfaces for all resources
│   │   ├── offering.ts        # Offering + CreateOfferingRequest + etc
│   │   ├── entitlement.ts
│   │   ├── product.ts
│   │   ├── package.ts
│   │   └── price-experiment.ts
│   ├── use-cases/             # Business logic (one class per operation)
│   │   ├── offering/
│   │   │   ├── create-offering.ts
│   │   │   ├── get-offering.ts
│   │   │   ├── update-offering.ts
│   │   │   ├── delete-offering.ts
│   │   │   └── list-offerings.ts
│   │   └── [similar structure for other 4 resources]
│   └── errors/
│       └── error-mapper.ts    # HTTP to MCP error mapping
├── infrastructure/
│   ├── revenuecat-client.ts   # HTTP client with retry logic
│   └── logger.ts              # Pino logger with secret redaction
└── presentation/
    └── mcp-server.ts          # MCP protocol handler + tool registration
```

## DEVELOPMENT APPROACH

### Current Status
Based on the PRD and Development Guide, this is a greenfield project starting from Phase 0. No implementation exists yet.

### Implementation Phases
1. **Phase 0**: Project setup (package.json, tsconfig, dependencies)
2. **Phase 1**: Core infrastructure (MCP server, HTTP client, logging)
3. **Phase 2**: Offerings resource (complete CRUD)
4. **Phase 3**: Remaining 4 resources (Entitlement, Product, Package, PriceExperiment)
5. **Phase 4**: Robustness (retry logic, pagination, validation)
6. **Phase 5**: Packaging (esbuild bundling, npm publishing)
7. **Phase 6**: Polish (documentation, testing, release)

### Key Configuration Files Needed
- `package.json` with bin entry: `"revenuecat-mcp": "./dist/index.js"`
- `tsconfig.json` with strict settings and path mapping
- `.env.example` with required environment variables
- `esbuild.config.js` for bundling

## IMPORTANT CODING GUIDELINES

### MCP Server Pattern
```typescript
#!/usr/bin/env node
// Entry point must be executable with shebang
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Always use STDIO transport, never HTTP/SSE
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Use Case Pattern
```typescript
export class CreateOfferingUseCase {
  constructor(private client: RevenueCatClient) {}
  
  async execute(request: CreateOfferingRequest): Promise<Offering> {
    return this.client.request<Offering>('POST', '/offerings', request);
  }
}
```

### Error Handling Pattern
Always map HTTP errors to MCP errors and never expose secrets:
```typescript
try {
  return await operation();
} catch (error) {
  logger.error({ error: 'Operation failed' }, 'No sensitive data in logs');
  throw mapHttpErrorToMcp(error);
}
```

### Logging Pattern
Use structured logging with automatic secret redaction:
```typescript
const logger = pino({
  redact: ['config.revenueCatSecretKey', '*.secret*', '*.token*']
});
```

## TESTING STRATEGY

Since this is manual testing only:
1. **IDE Integration**: Test all 25 commands in Cursor/VS Code
2. **Error Scenarios**: Invalid API keys, malformed requests
3. **Pagination**: Large datasets with cursor-based navigation
4. **Cross-platform**: npm installation on different OS

## SUCCESS METRICS

- [ ] All 25 MCP commands work correctly
- [ ] `npm install -g @yourorg/revenuecat-mcp` succeeds
- [ ] Bundle size under 5MB
- [ ] No secrets in logs (regex scan verification)
- [ ] 5-minute quick start from README
- [ ] IDE integration works seamlessly

## ENVIRONMENT VARIABLES

Required:
- `REVENUECAT_SECRET_KEY`: Bearer token for RevenueCat API (fail-fast if missing)

Optional:
- `RC_API_URL`: Override API URL (defaults to https://api.revenuecat.com/v2)
- `LOG_LEVEL`: Logging verbosity (defaults to 'info')

## COMMON PITFALLS TO AVOID

1. **DO NOT** create an HTTP server - this is STDIO only
2. **DO NOT** log secrets - always use Pino redaction
3. **DO NOT** bundle unnecessary dependencies - keep under 5MB
4. **DO NOT** use relative imports - configure TypeScript path mapping
5. **DO NOT** forget the shebang in index.ts - it must be executable
6. **DO NOT** create CLI commands - this is an MCP server, not a CLI tool

When working on this project, always refer to the PRD and Development Guide for specific requirements and maintain the clean architecture separation between layers.