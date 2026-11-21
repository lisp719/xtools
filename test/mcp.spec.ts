import { env } from 'cloudflare:workers';
import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

const ORIGIN = 'http://example.com';

async function mcpPost(body: unknown, sessionId?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
  };
  if (sessionId) headers['mcp-session-id'] = sessionId;
  const request = new Request(ORIGIN + '/mcp', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const ctx = createExecutionContext();
  const response = await worker.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

async function parseRpc(response: Response) {
  const text = await response.text();
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('text/event-stream')) {
    const dataLines = text
      .split('\n')
      .filter((line) => line.startsWith('data: '))
      .map((line) => line.slice('data: '.length));
    return JSON.parse(dataLines[0]);
  }
  return JSON.parse(text);
}

describe('MCP /mcp (build_xsearch_url only)', () => {
  it('initialize negotiates protocol', async () => {
    const res = await mcpPost({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-11-25',
        capabilities: {},
        clientInfo: { name: 'test', version: '0.0.0' },
      },
    });
    expect(res.status).toBe(200);
    const json = await parseRpc(res);
    expect(json.result?.serverInfo?.name).toBe('xtools');
  });

  it('tools/list exposes build_xsearch_url', async () => {
    const res = await mcpPost({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {},
    });
    expect(res.status).toBe(200);
    const json = await parseRpc(res);
    const names = (json.result?.tools ?? []).map((t: { name: string }) => t.name);
    expect(names).toEqual(['build_xsearch_url']);
  });

  it('tools/call builds an X search URL', async () => {
    const res = await mcpPost({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'build_xsearch_url',
        arguments: { query: 'hello', japaneseOnly: true },
      },
    });
    expect(res.status).toBe(200);
    const json = await parseRpc(res);
    const text = json.result?.content?.[0]?.text ?? '';
    expect(text).toContain('https://x.com/search?q=lang%3Aja%20hello');
    expect(json.result?.structuredContent?.url).toContain('https://x.com/search?q=lang%3Aja%20hello');
  });
});
