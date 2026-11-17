import * as z from 'zod/v4';
import { buildXsearchUrl } from './search';

export const TOOL_NAME = 'build_x_search_url' as const;

export const TOOL_DESCRIPTION =
  'Builds an X (Twitter) search URL from the given options. It only builds the search URL, it does not fetch results. 検索URLを作るだけで、結果は取得しない。' as const;

export const BUILD_X_SEARCH_URL_TOOL = {
  name: TOOL_NAME,
  description: TOOL_DESCRIPTION,
} as const;

export const filterEnum = z.enum(['images_only', 'links_only', 'no_images', 'no_links']);
export type FilterEnum = z.infer<typeof filterEnum>;

export const countTypeEnum = z.enum(['min_faves', 'max_faves', 'min_replies', 'max_replies']);
export type CountTypeEnum = z.infer<typeof countTypeEnum>;

const FILTER_TO_OPERATOR: Record<FilterEnum, string> = {
  images_only: 'filter:images',
  links_only: 'filter:links',
  no_images: '-filter:images',
  no_links: '-filter:links',
};

export const buildXSearchUrlInputSchema = z.object({
  query: z.string().min(1).describe('Search keywords (required)'),
  exact_match: z.boolean().optional().describe('Quote each word with double quotes'),
  japanese_only: z.boolean().optional().describe('Only Japanese tweets (lang:ja)'),
  exclude_replies: z.boolean().optional().describe('Exclude replies (-filter:replies)'),
  followers_only: z.boolean().optional().describe('Only show followed users (pf=on)'),
  latest_only: z.boolean().optional().describe('Show latest tab (f=live)'),
  filter: filterEnum.optional().describe('Media filter (enum, not free text)'),
  since: z.string().optional().describe('Start date, e.g. 2026-01-01'),
  until: z.string().optional().describe('End date, e.g. 2026-08-12'),
  count_type: countTypeEnum.optional().describe('Count operator (enum, not free text)'),
  count_value: z.coerce.string().optional().describe('Count threshold, e.g. 100'),
});

export type BuildXSearchUrlToolArgs = z.infer<typeof buildXSearchUrlInputSchema>;

export const buildXSearchUrlOutputSchema = z.object({
  url: z.string(),
  query: z.string(),
});

export type BuildXSearchUrlToolResult = z.infer<typeof buildXSearchUrlOutputSchema>;

export function buildXSearchUrlTool(args: BuildXSearchUrlToolArgs): BuildXSearchUrlToolResult {
  const url = buildXsearchUrl({
    query: args.query,
    exactMatch: args.exact_match,
    japaneseOnly: args.japanese_only,
    excludeReplies: args.exclude_replies,
    followersOnly: args.followers_only,
    latestOnly: args.latest_only,
    filter: args.filter ? FILTER_TO_OPERATOR[args.filter] : undefined,
    since: args.since || undefined,
    until: args.until || undefined,
    countType: args.count_type,
    countValue: args.count_type && args.count_value !== undefined && args.count_value !== '' ? String(args.count_value) : undefined,
  });
  const q = new URL(url).searchParams.get('q') ?? '';
  return { url, query: q };
}
