import { McpServer } from '@modelcontextprotocol/server';
import { BUILD_X_SEARCH_URL_TOOL, buildXSearchUrlInputSchema, buildXSearchUrlOutputSchema, buildXSearchUrlTool } from './mcp-tool';

export function createXtoolsMcpServer(): McpServer {
  const server = new McpServer({ name: 'xtools', version: '0.0.0' });
  server.registerTool(
    BUILD_X_SEARCH_URL_TOOL.name,
    {
      title: 'Build X search URL',
      description: BUILD_X_SEARCH_URL_TOOL.description,
      inputSchema: buildXSearchUrlInputSchema,
      outputSchema: buildXSearchUrlOutputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async (args) => {
      const result = buildXSearchUrlTool(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
        structuredContent: result,
      };
    },
  );
  return server;
}
