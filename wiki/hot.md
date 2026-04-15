---
title: Hot Cache
updated: 2026-04-16
purpose: Quick-load context for future sessions
---

# Hot Cache

## Project Identity
- **Name**: eifavpn-frontend (GlassVPN)
- **Type**: React 19 + Vite SPA — VPN-сервис
- **Backend**: Django REST API (eifavpn-backend)
- **Domain**: eifavpn.ru (prod), dev.eifavpn.ru (dev)
- **Telegram Mini App**: @EIFA_VPNbot
- **Server**: 5.101.81.90

## Stack
- React 19, React Router 7.14, Zustand 5, Tailwind CSS 4, HeroUI 3
- Motion 12, Liquid Glass React, Gravity UI Icons
- Vite + Oxc, ESLint, chunk splitting (vendor + ui)

## Key Files
- `src/main.jsx` — Entry, theme detection, MutationObserver against TG SDK overrides
- `src/App.jsx` — Routes, maintenance check, analytics
- `src/api/client.js` — apiFetch() with auto Bearer + 401 refresh
- `src/stores/authStore.js` — Zustand: user, tokens, login/logout/fetchMe
- `src/index.css` — oklch design tokens, dual theme, custom fonts

## API Modules
- `api/auth.js` — 15+ functions: login, register, verify, link accounts, merge
- `api/subscriptions.js` — plans, purchase, trial, devices, servers, rates, promo
- `api/referrals.js` — referral info, list, share
- `api/admin.js` — 30+ admin functions (dashboard, users, subs, payments, analytics, promo, notifications)

## Routes
- Landing: `/`, `/cabinet/login`, `/register`, `/terms`, `/download/:platform`, `/connect`
- Cabinet (auth): `/cabinet`, `/cabinet/purchase`, `/cabinet/servers`, `/cabinet/devices`, `/cabinet/referral`, `/cabinet/settings`, `/cabinet/guide`
- Admin (staff): `/admin/*` (14 admin routes)

## Layouts
- `LandingLayout` — Navbar + Footer + Background
- `CabinetLayout` — Sidebar (desktop) / BottomNav (mobile/TG) + Topbar
- `AdminLayout` — Admin sidebar + 14 routes

## Auth Methods (Frontend)
1. Email + 6-digit code (2-step)
2. Google OAuth redirect → callback with tokens
3. Telegram Login Widget (hash-based)
4. Telegram Mini App initData (auto-login)

## Payment Methods
- Telegram Stars (in-app), CryptoPay (USDT/TON), Wata (cards/SBP)
- 5-minute polling for payment completion

## Theming
- oklch color space, CSS custom properties
- data-theme="light"|"dark" on <html>
- TG SDK sync + MutationObserver protection
- Fonts: DM Sans (body), Manrope (headings), JetBrains Mono (code)

## Plans
- Standard: 3 devices, 1TB, 7 servers | 69-45₽/мес
- Pro: 4 devices, unlimited, 10 servers, adblock | 99-65₽/мес
- Max: 6 devices, unlimited, 14 servers, adblock, P2P | 149-99₽/мес

## Latest Ingest
- 2026-04-16: Full project scan — all modules documented
