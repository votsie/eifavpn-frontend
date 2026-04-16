---
title: EIFAVPN Frontend — Project Overview
updated: 2026-04-16
---

# EIFAVPN Frontend

**EIFAVPN (GlassVPN)** — React SPA для VPN-сервиса, работающий как обычный сайт и как Telegram Mini App. Бэкенд — [[EIFAVPN Backend]] (Django REST API).

## Стек технологий

| Компонент | Технология |
|-----------|-----------|
| Framework | React 19 + Vite |
| Routing | React Router DOM 7.14 |
| State | Zustand 5 (authStore) |
| UI Kit | HeroUI 3 (Button, Input, Modal, Spinner, etc.) |
| Styling | Tailwind CSS 4 + CSS custom properties (oklch) |
| Icons | Gravity UI Icons 2.18 |
| Animations | Motion 12 (Framer Motion) |
| Effects | Liquid Glass React |
| Telegram SDK | @vkruglikov/react-telegram-web-app |
| Linting | ESLint + React Hooks + React Refresh |
| Build | Vite + Oxc (chunk splitting: vendor, ui) |
| Analytics | Google Tag Manager + Яндекс.Метрика |

## Архитектура приложения

```
┌─────────────────────────────────────────────────┐
│                  App.jsx (Router)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Landing   │  │ Cabinet  │  │ Admin        │  │
│  │ Layout    │  │ Layout   │  │ Layout       │  │
│  │ (public)  │  │(Protected│  │(AdminRoute)  │  │
│  │           │  │  Route)  │  │ (staff only) │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│       │              │              │            │
│  ┌────┴────┐  ┌──────┴──────┐  ┌──┴──────┐    │
│  │Hero     │  │Overview     │  │Dashboard │    │
│  │Features │  │Purchase     │  │Users     │    │
│  │Plans    │  │Servers      │  │Subs      │    │
│  │Login    │  │Devices      │  │Payments  │    │
│  │Register │  │Referral     │  │+11 more  │    │
│  └─────────┘  │Settings     │  └──────────┘    │
│               │Guide        │                   │
│               └─────────────┘                   │
└─────────────────────────────────────────────────┘
         │                    │
    ┌────┴────┐         ┌────┴────┐
    │ Zustand │         │ API     │
    │ Auth    │         │ Modules │
    │ Store   │         │ client  │
    └─────────┘         │ auth    │
                        │ subs    │
                        │ referral│
                        │ admin   │
                        └────┬────┘
                             │
                    ┌────────┴────────┐
                    │  Django Backend  │
                    │  (eifavpn.ru)   │
                    └─────────────────┘
```

## Структура директорий

```
src/
├── main.jsx          — Точка входа, тема, MutationObserver
├── App.jsx           — Маршрутизация, maintenance check
├── index.css         — Темы, tokens, анимации
├── api/              — HTTP-клиент и API-модули
│   ├── client.js     — apiFetch + auto-refresh + ApiError
│   ├── auth.js       — Аутентификация, привязка, merge
│   ├── subscriptions.js — Подписки, планы, устройства
│   ├── referrals.js  — Реферальная программа
│   └── admin.js      — Админ-панель (30+ функций)
├── stores/
│   └── authStore.js  — Zustand: user, tokens, auth flow
├── utils/
│   ├── telegram.js   — isTelegramWebApp()
│   └── openPayment.js — Кросс-платформенное открытие URL
├── layouts/
│   ├── LandingLayout.jsx  — Лендинг (Navbar + Footer)
│   ├── CabinetLayout.jsx  — Кабинет (Sidebar + Topbar)
│   └── AdminLayout.jsx    — Админка (14 маршрутов)
├── components/
│   ├── Navbar.jsx, Footer.jsx, Background.jsx
│   ├── TelegramLoginWidget.jsx
│   ├── auth/ProtectedRoute.jsx, LoginForm.jsx
│   └── cabinet/Sidebar.jsx, Topbar.jsx, StatusBadge.jsx,
│         ConnectModal.jsx, MergeAccountModal.jsx
└── pages/
    ├── Landing.jsx, Hero.jsx, Features.jsx, Plans.jsx
    ├── Login.jsx, Register.jsx, Download.jsx, Connect.jsx
    ├── Terms.jsx, NotFound.jsx, TelegramApp.jsx
    └── cabinet/
        ├── Overview.jsx, Purchase.jsx, Servers.jsx
        ├── Devices.jsx, Referral.jsx, Settings.jsx, Guide.jsx
```

## Окружения

| Env | Branch | API URL | Deploy Path |
|-----|--------|---------|-------------|
| Dev | `dev` | dev.eifavpn.ru | /opt/eifavpn/dev/frontend/ |
| Prod | `main` | eifavpn.ru | /opt/eifavpn/prod/frontend/ |

Деплой через GitHub Actions → SCP на сервер 5.101.81.90.

## Ключевые бизнес-процессы

1. **[[Authentication Flow Frontend]]** — Email code, Google OAuth, Telegram Widget/Mini App
2. **[[Subscription Purchase Flow]]** — Выбор плана → оплата (Stars/Crypto/Card) → polling
3. **[[Telegram Mini App Integration]]** — Определение окружения, тема, deep links
4. **[[Theming System]]** — Light/Dark/Auto, oklch tokens, TG SDK sync
5. **[[VPN Connection Flow]]** — ConnectModal → hiddify:// deep link → fallback

## См. также

- [[EIFAVPN Backend]] — Django REST API (бэкенд)
- [[API Client Architecture]] — HTTP-клиент с auto-refresh
- [[Component Tree]] — Дерево компонентов
- [[CI CD Frontend]] — GitHub Actions деплой
