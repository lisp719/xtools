# プロジェクト概要

Xの補助ツールを開発するプロジェクトです。Hono + Cloudflare Workers で動作します。

# Structure

入口は `src/index.tsx`、核は `src/lib/search.ts`。

# Agent skills

## Issue tracker

GitHub Issues で管理 (lisp719/xtools)。詳細は `docs/agents/issue-tracker.md` を参照。

## Triage labels

デフォルト語彙 (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix)。詳細は `docs/agents/triage-labels.md` を参照。

## Domain docs

Single-context レイアウト (ルートの CONTEXT.md + docs/adr/)。詳細は `docs/agents/domain.md` を参照。
