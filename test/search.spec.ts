import { describe, it, expect } from 'vitest';
import { buildXhomeUrl, buildXsearchUrl, escapeDataString } from '../src/lib/search';

describe('escapeDataString (compatible with .NET Uri.EscapeDataString)', () => {
  it('escapes spaces, colons and non-reserved chars', () => {
    expect(escapeDataString('lang:ja -filter:replies filter:images')).toBe('lang%3Aja%20-filter%3Areplies%20filter%3Aimages');
  });

  it("escapes ! * ' ( ) like .NET does", () => {
    expect(escapeDataString("a!b*c'd(e)f g~h-i.j_k")).toBe('a%21b%2Ac%27d%28e%29f%20g~h-i.j_k');
  });

  it('escapes UTF-8 multibyte characters', () => {
    expect(escapeDataString('日本語 query')).toBe('%E6%97%A5%E6%9C%AC%E8%AA%9E%20query');
  });

  it('returns empty string for empty input', () => {
    expect(escapeDataString('')).toBe('');
  });
});

describe('buildXhomeUrl', () => {
  it('builds base URL with -filter:replies and live+pf', () => {
    expect(buildXhomeUrl({})).toBe('https://x.com/search?q=-filter:replies&f=live&pf=on');
  });

  it('appends filter', () => {
    expect(buildXhomeUrl({ filter: 'filter:images' })).toBe('https://x.com/search?q=-filter:replies%20filter:images&f=live&pf=on');
  });

  it('appends until date', () => {
    expect(buildXhomeUrl({ until: '2026-08-12' })).toBe('https://x.com/search?q=-filter:replies%20until:2026-08-12&f=live&pf=on');
  });

  it('appends filter and until together', () => {
    expect(buildXhomeUrl({ filter: 'filter:images', until: '2026-08-12' })).toBe(
      'https://x.com/search?q=-filter:replies%20filter:images%20until:2026-08-12&f=live&pf=on',
    );
  });
});

describe('buildXsearchUrl', () => {
  it('builds base URL with empty query', () => {
    expect(buildXsearchUrl({})).toBe('https://x.com/search?q=');
  });

  it('builds query with all toggles and filters', () => {
    const url = buildXsearchUrl({
      japaneseOnly: true,
      excludeReplies: true,
      followersOnly: true,
      filter: 'filter:images',
      since: '2026-01-01',
      until: '2026-08-12',
      countType: 'min_faves',
      countValue: '100',
      query: '検索語',
    });
    expect(url).toBe(
      'https://x.com/search?q=lang%3Aja%20-filter%3Areplies%20filter%3Aimages%20since%3A2026-01-01%20until%3A2026-08-12%20min_faves%3A100%20%E6%A4%9C%E7%B4%A2%E8%AA%9E&pf=on',
    );
    expect(url).not.toContain('filter%3Afollows');
  });

  it('omits lang:ja when japaneseOnly is false or omitted', () => {
    expect(buildXsearchUrl({ query: 'hello', japaneseOnly: false })).toBe('https://x.com/search?q=hello');
    expect(buildXsearchUrl({ query: 'hello' })).toBe('https://x.com/search?q=hello');
  });

  it('adds lang:ja when japaneseOnly is true', () => {
    expect(buildXsearchUrl({ query: 'hello', japaneseOnly: true })).toBe('https://x.com/search?q=lang%3Aja%20hello');
  });

  it('adds pf=on and omits filter:follows when followersOnly is checked', () => {
    const url = buildXsearchUrl({ query: 'hello', followersOnly: true });
    expect(url).toBe('https://x.com/search?q=hello&pf=on');
    expect(url).not.toContain('filter:follows');
    expect(url).not.toContain('filter%3Afollows');
  });

  it('omits the pf param when followersOnly is unchecked', () => {
    expect(buildXsearchUrl({ query: 'hello', followersOnly: false })).toBe('https://x.com/search?q=hello');
    expect(buildXsearchUrl({ query: 'hello' })).toBe('https://x.com/search?q=hello');
  });

  it('trims the query', () => {
    const url = buildXsearchUrl({ query: '  hello world  ' });
    expect(url).toBe('https://x.com/search?q=hello%20world');
  });

  it('requires both countType and countValue', () => {
    expect(buildXsearchUrl({ countType: 'min_faves' })).toBe('https://x.com/search?q=');
    expect(buildXsearchUrl({ countValue: '100' })).toBe('https://x.com/search?q=');
  });

  it('quotes each word separately when exactMatch is true', () => {
    const url = buildXsearchUrl({ query: 'hello world', exactMatch: true });
    expect(url).toBe('https://x.com/search?q=%22hello%22%20%22world%22');
  });

  it('quotes a single word when exactMatch is true', () => {
    const url = buildXsearchUrl({ query: 'hello', exactMatch: true });
    expect(url).toBe('https://x.com/search?q=%22hello%22');
  });

  it('trims and collapses spaces before quoting each word', () => {
    const url = buildXsearchUrl({ query: '  hello   world  ', exactMatch: true });
    expect(url).toBe('https://x.com/search?q=%22hello%22%20%22world%22');
  });
});
