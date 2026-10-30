# プロジェクト概要

Xの補助ツールを開発するプロジェクトです。Hono + Cloudflare Workers で動作します。

# Commands

- `pnpm dev` — wrangler dev でローカル開発サーバーを起動（既定 `http://127.0.0.1:8787`）
- `pnpm test` — Vitest でテストを実行（CI 相当は `pnpm test --run`）
- `pnpm typecheck` — TypeScript の型チェック
- `pnpm deploy` — Cloudflare Workers へデプロイ
- `pnpm wrangler deploy --dry-run --outdir /tmp/xtools-build` — バンドルと検証のみ（アップロードなし）

## Cloud Agent での起動手順

環境ビルド済み VM でも、作業ブランチで lockfile が変わった場合は `pnpm install --frozen-lockfile` を再実行する。

1. `pnpm install --frozen-lockfile`
2. `pnpm typecheck` と `pnpm test --run`
3. 開発サーバー: `pnpm dev`（長時間起動は tmux セッション推奨）
4. 動作確認: `GET /`, `/Index`, `/xhome`, `/xsearch` が HTML 200。フォーム POST は X.com へ 302 リダイレクト（外部 API・ログイン不要）
5. ビルド確認: 上記 `deploy --dry-run`

ローカル開発・テストに `.dev.vars` や Cloudflare 認証は不要。`pnpm deploy` のみ Wrangler の Cloudflare ログイン（または API トークン）が必要。

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
