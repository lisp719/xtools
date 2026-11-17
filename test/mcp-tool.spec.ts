import { describe, it, expect } from 'vitest';
import { BUILD_X_SEARCH_URL_TOOL, buildXSearchUrlTool } from '../src/lib/mcp-tool';

describe('build_x_search_url tool', () => {
  it('ツール名と説明を持つ（説明に「検索URLを作るだけで、結果は取得しない」と明記）', () => {
    expect(BUILD_X_SEARCH_URL_TOOL.name).toBe('build_x_search_url');
    expect(BUILD_X_SEARCH_URL_TOOL.description).toContain('検索URLを作るだけで、結果は取得しない');
  });

  it('query のみでベースURLを作る', () => {
    expect(buildXSearchUrlTool({ query: 'hello' })).toEqual({
      url: 'https://x.com/search?q=hello',
      query: 'hello',
    });
  });

  it('japanese_only で lang:ja を付与する', () => {
    expect(buildXSearchUrlTool({ query: 'hello', japanese_only: true }).url).toBe('https://x.com/search?q=lang%3Aja%20hello');
  });

  it('exclude_replies で -filter:replies を付与する', () => {
    expect(buildXSearchUrlTool({ query: 'hello', exclude_replies: true }).url).toBe('https://x.com/search?q=-filter%3Areplies%20hello');
  });

  it('followers_only で pf=on を付与する', () => {
    expect(buildXSearchUrlTool({ query: 'hello', followers_only: true }).url).toBe('https://x.com/search?q=hello&pf=on');
  });

  it('latest_only で f=live を付与する', () => {
    expect(buildXSearchUrlTool({ query: 'hello', latest_only: true }).url).toBe('https://x.com/search?q=hello&f=live');
  });

  it('filter の enum を X 演算子に写像する', () => {
    expect(buildXSearchUrlTool({ query: 'hello', filter: 'images_only' }).url).toBe('https://x.com/search?q=filter%3Aimages%20hello');
    expect(buildXSearchUrlTool({ query: 'hello', filter: 'links_only' }).url).toBe('https://x.com/search?q=filter%3Alinks%20hello');
    expect(buildXSearchUrlTool({ query: 'hello', filter: 'no_images' }).url).toBe('https://x.com/search?q=-filter%3Aimages%20hello');
    expect(buildXSearchUrlTool({ query: 'hello', filter: 'no_links' }).url).toBe('https://x.com/search?q=-filter%3Alinks%20hello');
  });

  it('since / until を付与する', () => {
    expect(buildXSearchUrlTool({ query: 'hello', since: '2026-01-01', until: '2026-08-12' }).url).toBe(
      'https://x.com/search?q=since%3A2026-01-01%20until%3A2026-08-12%20hello',
    );
  });

  it('count_type + count_value を付与する', () => {
    expect(buildXSearchUrlTool({ query: 'hello', count_type: 'min_faves', count_value: '100' }).url).toBe(
      'https://x.com/search?q=min_faves%3A100%20hello',
    );
  });

  it('exact_match で各単語をクォートする', () => {
    expect(buildXSearchUrlTool({ query: 'hello world', exact_match: true }).url).toBe('https://x.com/search?q=%22hello%22%20%22world%22');
  });

  it('全指定で既存ビルダーと等価なURLを作る', () => {
    expect(
      buildXSearchUrlTool({
        query: '検索語',
        japanese_only: true,
        exclude_replies: true,
        followers_only: true,
        filter: 'images_only',
        since: '2026-01-01',
        until: '2026-08-12',
        count_type: 'min_faves',
        count_value: '100',
      }).url,
    ).toBe(
      'https://x.com/search?q=lang%3Aja%20-filter%3Areplies%20filter%3Aimages%20since%3A2026-01-01%20until%3A2026-08-12%20min_faves%3A100%20%E6%A4%9C%E7%B4%A2%E8%AA%9E&pf=on',
    );
  });
});
