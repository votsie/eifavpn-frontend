---
title: Component Tree
type: entity
updated: 2026-04-16
---

# Component Tree

Полное дерево React-компонентов приложения.

## Иерархия

```
<BrowserRouter> (main.jsx)
└── <App> (App.jsx — Router)
    │
    ├── <LandingLayout>
    │   ├── <Background />
    │   ├── <Navbar />
    │   │   └── ThemeToggle (Sun/Moon)
    │   ├── <Outlet /> →
    │   │   ├── <Landing> → <Hero> + <Features> + <Plans>
    │   │   ├── <Login> → <LoginForm> → useTelegramLogin()
    │   │   ├── <Register> → useTelegramLogin()
    │   │   ├── <Terms>
    │   │   └── <Download>
    │   └── <Footer />
    │
    ├── <ProtectedRoute>
    │   └── <CabinetLayout>
    │       ├── <Background />
    │       ├── <Sidebar> (desktop: fixed w-60 | mobile: bottom nav)
    │       ├── <Topbar> (desktop only)
    │       └── <Outlet /> →
    │           ├── <Overview>
    │           │   └── <ConnectModal> (hiddify:// deep link)
    │           ├── <Purchase>
    │           │   └── PromoInput
    │           ├── <Servers>
    │           ├── <Devices>
    │           ├── <Referral>
    │           ├── <Settings>
    │           │   └── <MergeAccountModal>
    │           └── <Guide>
    │
    ├── <AdminLayout>
    │   ├── Admin Sidebar (14 маршрутов)
    │   └── <Outlet /> → Admin Pages
    │
    ├── <TelegramApp> (Mini App entry)
    ├── <Connect> (deep link handler)
    └── <NotFound> (404)
```

## Shared Components

| Компонент | Файл | Назначение |
|-----------|------|-----------|
| `Background` | components/Background.jsx | Градиентный фон (radial + accent) |
| `Navbar` | components/Navbar.jsx | Навигация лендинга + тема + CTA |
| `Footer` | components/Footer.jsx | Логотип + ссылки + copyright |
| `StatusBadge` | components/cabinet/StatusBadge.jsx | ACTIVE/EXPIRED/LIMITED/DISABLED chip |
| `ConnectModal` | components/cabinet/ConnectModal.jsx | 5-шаговый wizard подключения VPN |
| `MergeAccountModal` | components/cabinet/MergeAccountModal.jsx | Подтверждение merge аккаунтов |
| `ProtectedRoute` | components/auth/ProtectedRoute.jsx | Guard для cabinet routes |
| `LoginForm` | components/auth/LoginForm.jsx | Google + Telegram + Email auth |
| `TelegramLoginWidget` | components/TelegramLoginWidget.jsx | Hook useTelegramLogin() |

## Паттерны

- **Layout pattern**: `<Layout>` → `<Outlet>` для вложенных маршрутов
- **Protected routes**: `<ProtectedRoute>` оборачивает весь CabinetLayout
- **Modal pattern**: Модалки внутри страниц (ConnectModal в Overview, MergeAccountModal в Settings)
- **Responsive**: Desktop sidebar ↔ Mobile bottom nav (определяется isTelegramWebApp())
- **Hook extraction**: `useTelegramLogin()` выделен в отдельный hook

## См. также

- [[Layouts Architecture]] — Детали лейаутов
- [[Telegram Mini App Integration]] — TG-специфичная адаптация
