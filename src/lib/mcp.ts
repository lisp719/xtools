import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { buildXsearchUrl } from './search';

const inputSchema = z.object({
  japaneseOnly: z.boolean().optional(),
  excludeReplies: z.boolean().optional(),
  followersOnly: z.boolean().optional(),
  latestOnly: z.boolean().optional(),
  filter: z.string().optional(),
  since: z.string().optional(),
  until: z.string().optional(),
  countType: z.string().optional(),
  countValue: z.string().optional(),
  query: z.string().optional(),
  exactMatch: z.boolean().optional(),
});

const outputSchema = z.object({
  url: z.string(),
});

export function createXtoolsMcpServer(): McpServer {
  const server = new McpServer({ name: 'xtools', version: '0.0.0' });
  server.registerTool(
    'build_xsearch_url',
    {
      description: 'Build an X (Twitter) search URL from structured options. Returns a https://x.com/search URL.',
      inputSchema,
      outputSchema,
    },
    async (args) => {
      const url = buildXsearchUrl({
        japaneseOnly: args.japaneseOnly,
        excludeReplies: args.excludeReplies,
        followersOnly: args.followersOnly,
        latestOnly: args.latestOnly,
        filter: args.filter,
        since: args.since,
        until: args.until,
        countType: args.countType,
        countValue: args.countValue,
        query: args.query,
        exactMatch: args.exactMatch,
      });
      return {
        content: [{ type: 'text', text: url }],
        structuredContent: { url },
      };
    },
  );
  return server;
}
