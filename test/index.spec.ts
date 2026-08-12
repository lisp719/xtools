import { env, exports } from 'cloudflare:workers';
import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

const WORKER_ORIGIN = 'http://example.com';

function postForm(path: string, body: Record<string, string>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(body)) {
    form.append(key, value);
  }
  return new Request(WORKER_ORIGIN + path, { method: 'POST', body: form });
}

describe('xtools worker', () => {
  describe('GET /', () => {
    it('renders links to Xhome and Xsearch', async () => {
      const request = new Request(WORKER_ORIGIN + '/');
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
      const html = await response.text();
      expect(html).toContain('Xhome');
      expect(html).toContain('Xsearch');
    });
  });

  describe('GET /xhome', () => {
    it('renders the search form', async () => {
      const request = new Request(WORKER_ORIGIN + '/xhome');
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
      const html = await response.text();
      expect(html).toContain('datetime-local');
      expect(html).toContain('filter');
    });
  });

  describe('POST /xhome', () => {
    it('redirects to x.com search with until and filter', async () => {
      const ctx = createExecutionContext();
      const response = await worker.fetch(postForm('/xhome', { until: '2026-08-12T10:30', filter: 'filter:images' }), env, ctx);
      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe(
        'https://x.com/search?q=-filter:replies%20filter:images%20until:2026-08-12_10:30:00_JST&f=live&pf=on',
      );
    });
  });

  describe('POST /xsearch', () => {
    it('redirects with the assembled query', async () => {
      const ctx = createExecutionContext();
      const response = await worker.fetch(
        postForm('/xsearch', {
          query: '検索語',
          japaneseOnly: 'true',
          excludeReplies: 'true',
          followersOnly: 'true',
          filter: 'filter:links',
          since: '2026-01-01',
          until: '2026-08-12',
          countType: 'min_faves',
          countValue: '100',
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe(
        'https://x.com/search?q=lang%3Aja%20-filter%3Areplies%20filter%3Afollows%20filter%3Alinks%20since%3A2026-01-01%20until%3A2026-08-12%20min_faves%3A100%20%E6%A4%9C%E7%B4%A2%E8%AA%9E&f=live',
      );
    });
  });

  describe('unknown route', () => {
    it('returns 404', async () => {
      const response = await exports.default.fetch(WORKER_ORIGIN + '/nope');
      expect(response.status).toBe(404);
    });
  });
});
