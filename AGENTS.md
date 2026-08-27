# プロジェクト概要

Xの補助ツールを開発するプロジェクトです。Hono + Cloudflare Workers で動作します。

# Commands

- `pnpm dev` — wrangler dev でローカル開発サーバーを起動
- `pnpm test` — Vitest でテストを実行
- `pnpm typecheck` — TypeScript の型チェック
- `pnpm deploy` — Cloudflare Workers へデプロイ

# Structure

- `src/index.tsx` — Hono アプリ本体（ルーティング）
- `src/lib/search.ts` — X.com 検索 URL の組み立てロジック（純粋関数）
- `src/pages/` — ページコンポーネント（Hono JSX）
- `public/` — 静的アセット（Static Assets で配信）
- `test/` — Vitest テスト（URL ビルダーの互換性テスト含む）

## Agent skills

### Issue tracker

GitHub Issues で管理 (lisp719/xtools)。詳細は `docs/agents/issue-tracker.md` を参照。

### Triage labels

デフォルト語彙 (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix)。詳細は `docs/agents/triage-labels.md` を参照。

### Domain docs

Single-context レイアウト (ルートの CONTEXT.md + docs/adr/)。詳細は `docs/agents/domain.md` を参照。
