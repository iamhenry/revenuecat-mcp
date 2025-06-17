# RevenueCat MCP Server

A Model Context Protocol (MCP) server that exposes the complete RevenueCat v2 REST API for seamless integration with AI agents and IDEs like Cursor and VS Code.

## Features

- **Complete API Coverage**: All 25 CRUD operations across 5 RevenueCat resources
- **IDE Integration**: Native MCP support for Cursor, VS Code, and other compatible IDEs
- **Type Safety**: Full TypeScript implementation with comprehensive validation
- **Production Ready**: Retry logic, error handling, and structured logging
- **Lightweight**: Single executable under 5MB

## Supported Resources

| Resource | Create | Read | Update | Delete | List |
|----------|--------|------|--------|--------|------|
| Offerings | ✅ | ✅ | ✅ | ✅ | ✅ |
| Products | ✅ | ✅ | ✅ | ✅ | ✅ |
| Entitlements | ✅ | ✅ | ✅ | ✅ | ✅ |
| Packages | ✅ | ✅ | ✅ | ✅ | ✅ |
| Price Experiments | ✅ | ✅ | ✅ | ✅ | ✅ |

## Installation

### Option 1: Global Installation (Recommended)
```bash
npm install -g revenuecat-mcp
```

### Option 2: From Source
```bash
git clone https://github.com/iamhenry/revenuecat-mcp.git
cd revenuecat-mcp
npm install
npm run build
npm install -g .
```

## Configuration

### 1. Environment Setup
Create a `.env` file in your project or set environment variables:

```env
REVENUECAT_SECRET_KEY=sk_your_secret_key_here
RC_API_URL=https://api.revenuecat.com/v2  # Optional
LOG_LEVEL=info                            # Optional
```

### 2. Get Your RevenueCat Credentials
1. Log in to your [RevenueCat Dashboard](https://app.revenuecat.com)
2. Navigate to your project settings
3. Generate a secret key with appropriate permissions
4. Note your project ID from the URL or project settings

## IDE Integration

### Cursor
```bash
# Add the MCP server to Cursor
claude mcp add revenuecat revenuecat-mcp

# Test the integration
claude mcp test revenuecat
```

### VS Code
Add to your MCP configuration file:
```json
{
  "servers": {
    "revenuecat": {
      "command": "revenuecat-mcp"
    }
  }
}
```

## Usage Examples

### List Products
```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "ListProducts", "arguments": {"project_id": "your_project_id"}}}' | revenuecat-mcp
```

### Create Offering
```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "CreateOffering", "arguments": {"project_id": "your_project_id", "name": "Premium Offering", "description": "Our premium subscription offering"}}}' | revenuecat-mcp
```

### Get Product Details
```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "GetProduct", "arguments": {"project_id": "your_project_id", "id": "prod_123456"}}}' | revenuecat-mcp
```

## Available MCP Tools

### Offerings
- `CreateOffering` - Create a new offering
- `GetOffering` - Retrieve offering details
- `UpdateOffering` - Update offering properties
- `DeleteOffering` - Delete an offering
- `ListOfferings` - List all offerings with pagination

### Products
- `CreateProduct` - Create a new product
- `GetProduct` - Retrieve product details
- `UpdateProduct` - Update product properties
- `DeleteProduct` - Delete a product
- `ListProducts` - List all products with pagination

### Entitlements
- `CreateEntitlement` - Create a new entitlement
- `GetEntitlement` - Retrieve entitlement details
- `UpdateEntitlement` - Update entitlement properties
- `DeleteEntitlement` - Delete an entitlement
- `ListEntitlements` - List all entitlements with pagination

### Packages
- `CreatePackage` - Create a new package
- `GetPackage` - Retrieve package details
- `UpdatePackage` - Update package properties
- `DeletePackage` - Delete a package
- `ListPackages` - List all packages with pagination

### Price Experiments
- `CreatePriceExperiment` - Create a new price experiment
- `GetPriceExperiment` - Retrieve price experiment details
- `UpdatePriceExperiment` - Update price experiment properties
- `DeletePriceExperiment` - Delete a price experiment
- `ListPriceExperiments` - List all price experiments with pagination

## Error Handling

The server maps RevenueCat HTTP errors to appropriate MCP error codes:

- `400 Bad Request` → `VALIDATION_ERROR`
- `401 Unauthorized` → `UNAUTHENTICATED`
- `403 Forbidden` → `FORBIDDEN`
- `404 Not Found` → `NOT_FOUND`
- `429 Too Many Requests` → `RATE_LIMITED`
- `500+ Server Errors` → `INTERNAL`

## Development

### Prerequisites
- Node.js ≥18
- npm or yarn
- RevenueCat account with API access

### Local Development
```bash
# Clone the repository
git clone https://github.com/iamhenry/revenuecat-mcp.git
cd revenuecat-mcp

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Build the project
npm run build

# Test locally
npm run dev
```

### Project Structure
```
src/
├── index.ts                    # MCP server entry point
├── core/
│   ├── config.ts              # Environment configuration
│   ├── entities/              # TypeScript interfaces
│   ├── use-cases/             # Business logic
│   └── validation/            # Input validation
├── infrastructure/
│   ├── revenuecat-client.ts   # HTTP client
│   └── logger.ts              # Structured logging
└── presentation/
    └── mcp-server.ts          # MCP protocol handler
```

## Security

- NO secrets are logged (automatic redaction)
- Environment variables are validated at startup
- Input validation for all API calls
- Secure error handling without data leakage

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature-name`
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📚 [RevenueCat Documentation](https://docs.revenuecat.com)
- 🐛 [Issue Tracker](https://github.com/iamhenry/revenuecat-mcp/issues)
- 💬 [Discussions](https://github.com/iamhenry/revenuecat-mcp/discussions)

## Changelog

### v1.0.0
- Initial release with complete RevenueCat v2 API coverage
- Support for all 5 resources with full CRUD operations
- MCP integration for popular IDEs
- Production-ready error handling and logging