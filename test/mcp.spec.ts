import { env } from 'cloudflare:workers';
import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

const WORKER_ORIGIN = 'http://example.com';

function mcpRequest(method: string, id: number | string, params?: unknown) {
  return new Request(WORKER_ORIGIN + '/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params: params ?? {} }),
  });
}

async function callMcp(method: string, params?: unknown) {
  const ctx = createExecutionContext();
  const response = await worker.fetch(mcpRequest(method, 1, params), env, ctx);
  await waitOnExecutionContext(ctx);
  const text = await response.text();
  const dataLine = text.split('\n').find((line) => line.startsWith('data: '));
  if (!dataLine) throw new Error(`No SSE data in response: ${response.status} ${text}`);
  return JSON.parse(dataLine.slice('data: '.length));
}

describe('POST /mcp', () => {
  it('tools/list に build_x_search_url を広告する', async () => {
    const result = await callMcp('tools/list');
    const tool = result.result.tools.find((t: { name: string }) => t.name === 'build_x_search_url');
    expect(tool).toBeDefined();
    expect(tool.description).toContain('検索URLを作るだけで、結果は取得しない');
    expect(tool.inputSchema.required).toContain('query');
  });

  it('tools/call で既存ビルダーと等価なURLを返す', async () => {
    const result = await callMcp('tools/call', {
      name: 'build_x_search_url',
      arguments: { query: 'hello' },
    });
    const structured = result.result.structuredContent as { url: string; query: string };
    expect(structured.url).toBe('https://x.com/search?q=hello');
    expect(structured.query).toBe('hello');
  });

  it('tools/call で enum フィルタと全オプションが使える', async () => {
    const result = await callMcp('tools/call', {
      name: 'build_x_search_url',
      arguments: {
        query: '検索語',
        japanese_only: true,
        exclude_replies: true,
        followers_only: true,
        filter: 'images_only',
        since: '2026-01-01',
        until: '2026-08-12',
        count_type: 'min_faves',
        count_value: '100',
      },
    });
    const structured = result.result.structuredContent as { url: string; query: string };
    expect(structured.url).toBe(
      'https://x.com/search?q=lang%3Aja%20-filter%3Areplies%20filter%3Aimages%20since%3A2026-01-01%20until%3A2026-08-12%20min_faves%3A100%20%E6%A4%9C%E7%B4%A2%E8%AA%9E&pf=on',
    );
  });
});
