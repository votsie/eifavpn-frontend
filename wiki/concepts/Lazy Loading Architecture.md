---
title: Lazy Loading Architecture
type: concept
status: developing
created: 2026-04-16
updated: 2026-04-16
tags: [performance, routing, bundle]
sources: [src/App.jsx, vite.config.js]
---

# Lazy Loading Architecture

Route-level code splitting через `React.lazy()` + `Suspense`.

## Стратегия загрузки

### Eager (загружается сразу)
Критичные для первого рендера:
- **Layouts**: LandingLayout, CabinetLayout, AdminLayout — нужны для shell
- **Entry pages**: Landing, Login, Register, NotFound — точки входа пользователей

### Lazy (загружается по требованию)
Всё остальное:
- **Public**: Terms, TelegramApp, Download, Connect
- **Cabinet**: Overview, Purchase, Servers, Devices, Referral, Settings, Guide
- **Admin**: Dashboard, Users, UserDetail, Subscriptions, Payments, Referrals, Analytics, Notifications, Promo, Audit, System, Export, Settings, Pricing

## Chunk splitting (Vite)

Двухуровневое разделение:

```
vite.config.js — manualChunks:
┌────────────────────────────────────────────────┐
│  vendor.js (~221 KB)                           │
│    react, react-dom, react-router-dom          │
│                                                │
│  ui.js (~248 KB)                               │
│    @heroui/*, motion                           │
│                                                │
│  index.js (~62 KB)                             │
│    App shell, layouts, eager pages             │
│                                                │
│  [page].js (2-21 KB каждый)                    │
│    Lazy-loaded route chunks                    │
└────────────────────────────────────────────────┘
```

## Fallback UI

`<Suspense fallback={<PageSpinner />}>` оборачивает все Routes. При загрузке chunk-а пользователь видит centered спиннер.

## Эффект

| Метрика | До | После |
|---------|-----|-------|
| Initial JS | ~530 KB | ~530 KB vendor+ui + 62 KB app |
| Admin code loaded for regular users | Всегда | Никогда |
| Per-page chunk | Нет | 2-21 KB |

> [!key-insight]
> Admin-панель — ~80 KB кода, который загружался всем пользователям. Теперь загружается только для staff.

## См. также

- [[CI CD Frontend]] — Vite build + chunk splitting
- [[Route Protection Architecture]] — Lazy + защита маршрутов
- [[Component Tree]] — Какие компоненты lazy
- [[Layouts Architecture]] — Eager-loaded layouts
