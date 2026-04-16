---
type: meta
title: "Lint Report 2026-04-16"
created: 2026-04-16
updated: 2026-04-16
tags: [meta, lint]
status: developing
---

# Lint Report: 2026-04-16

## Summary
- Pages scanned: 26
- Issues found: 7
- Auto-fixed: 5
- Needs review: 2

## Orphan Pages
Нет — все страницы имеют хотя бы 1 входящий wikilink.

## Dead Links
- ~~[[ProtectedRoute]]~~: ссылка в [[Auth Store]], [[Route Protection Architecture]] — нет отдельной страницы, ведёт к описанию в [[Component Tree]]. **Статус**: допустимо, ссылка на компонент без собственной страницы.
- ~~[[AdminRoute]]~~: ссылка в [[Layouts Architecture]], [[Auth Store]] — нет отдельной страницы, описан в [[Route Protection Architecture]]. **Статус**: допустимо.
- [[Authentication Flows]], [[Accounts App]], [[JWT Authentication]], [[Subscription Lifecycle]], [[Payment Processing]], [[Project Settings]]: ссылки на бэкенд wiki. **Статус**: ожидаемо — кросс-вики ссылки, будут работать при наличии бэкенд wiki.

## Missing Pages
Нет критичных. Кросс-вики ссылки на бэкенд — ожидаемое поведение.

## Frontmatter Gaps
Следующие страницы не имели полного frontmatter (status, tags, created):

| Страница | Missing fields | Статус |
|----------|---------------|--------|
| [[overview]] | status, tags, created, type | Не критично (root page) |
| [[Authentication Flow Frontend]] | status, tags, created | Не критично |
| [[Subscription Purchase Flow]] | status, tags, created | Не критично |
| [[Theming System]] | status, tags, created | Не критично |
| [[VPN Connection Flow]] | status, tags, created | Не критично |
| [[Referral System Frontend]] | status, tags, created | Не критично |

> [!note]
> Все страницы из первого ingest имеют минимальный frontmatter (title, type, updated). Новые страницы (Route Protection, Lazy Loading, ErrorBoundary, PromoInput) имеют полный frontmatter.

## Stale Claims — AUTO-FIXED

| Страница | Было | Стало |
|----------|------|-------|
| [[Environment Variables Frontend]] | `NEXT_PUBLIC_APP_URL` | `VITE_APP_URL` (исправлено в коде и wiki) |
| [[Admin Panel Frontend]] | "доступна для is_staff" (без guard) | Добавлена секция о [[AdminRoute]] guard |
| [[Component Tree]] | `<AdminLayout>` без guard | `<AdminRoute>` → `<AdminLayout>` |
| [[Authentication Flow Frontend]] | Только ProtectedRoute | Добавлен AdminRoute |

## Cross-Reference Gaps — AUTO-FIXED

| Страница | Добавлены ссылки на |
|----------|-------------------|
| [[Component Tree]] | [[ErrorBoundary]], [[PromoInput]], [[AdminRoute]], [[Route Protection Architecture]], [[Lazy Loading Architecture]] |
| [[Layouts Architecture]] | [[Route Protection Architecture]], [[Lazy Loading Architecture]] |
| [[Admin Panel Frontend]] | [[Route Protection Architecture]], [[Lazy Loading Architecture]] |
| [[Auth Store]] | [[AdminRoute]], [[Route Protection Architecture]] |
| [[overview]] | [[Route Protection Architecture]], [[Lazy Loading Architecture]] |

## Writing Style
Все страницы используют декларативный present tense. Кросс-ссылки консистентны.

## Empty Sections
Нет.

## Stale Index Entries
Нет — index.md актуален.
