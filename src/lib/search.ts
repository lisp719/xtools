export function escapeDataString(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

export function formatDate(dateStr: string): string {
  const [datePart, timePart] = dateStr.split('T');
  let time = timePart;
  if (time && time.split(':').length === 2) {
    time = time + ':00';
  }
  return `${datePart}_${time}_JST`;
}

export interface XhomeOptions {
  filter?: string;
  until?: string;
}

export function buildXhomeUrl(options: XhomeOptions): string {
  let url = 'https://x.com/search?q=-filter:replies';
  if (options.filter) url += '%20' + options.filter;
  if (options.until) url += '%20until:' + formatDate(options.until);
  url += '&f=live&pf=on';
  return url;
}

export interface XsearchOptions {
  japaneseOnly?: boolean;
  excludeReplies?: boolean;
  followersOnly?: boolean;
  filter?: string;
  since?: string;
  until?: string;
  countType?: string;
  countValue?: string;
  query?: string;
}

export function buildXsearchUrl(options: XsearchOptions): string {
  const parts: string[] = [];

  if (options.japaneseOnly) parts.push('lang:ja');
  if (options.excludeReplies) parts.push('-filter:replies');
  if (options.followersOnly) parts.push('filter:follows');
  if (options.filter) parts.push(options.filter);
  if (options.since) parts.push('since:' + options.since);
  if (options.until) parts.push('until:' + options.until);
  if (options.countType && options.countValue) parts.push(options.countType + ':' + options.countValue);
  if (options.query && options.query.trim()) parts.push(options.query.trim());

  const q = parts.join(' ');
  const encoded = q ? escapeDataString(q) : '';
  return 'https://x.com/search?q=' + encoded + '&f=live';
}
