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
