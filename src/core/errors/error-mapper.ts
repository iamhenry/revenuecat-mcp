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