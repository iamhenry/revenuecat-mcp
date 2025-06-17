#!/usr/bin/env node

// Simple MCP client test to verify RevenueCat integration
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function testMCPServer() {
  console.log('🧪 Testing RevenueCat MCP Server...\n');
  
  // Start the MCP server
  const server = spawn('revenuecat-mcp', [], {
    cwd: __dirname,
    env: { ...process.env },
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let output = '';
  
  server.stdout.on('data', (data) => {
    output += data.toString();
  });

  server.stderr.on('data', (data) => {
    console.log('Server log:', data.toString());
  });

  // Wait a moment for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test ListOfferings (read-only operation)
  const testRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "ListOfferings",
      arguments: {}
    }
  };

  console.log('📋 Testing ListOfferings tool...');
  console.log('Request:', JSON.stringify(testRequest, null, 2));

  server.stdin.write(JSON.stringify(testRequest) + '\n');

  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 3000));

  server.kill();

  console.log('\n📤 Server Response:');
  console.log(output);
  
  return output;
}

testMCPServer().catch(console.error);