import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { createXtoolsMcpServer } from './lib/mcp-server';

serveStdio(() => createXtoolsMcpServer());

console.error('xtools MCP server is listening on stdio');
