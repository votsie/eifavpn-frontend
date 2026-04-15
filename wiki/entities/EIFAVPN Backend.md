---
title: EIFAVPN Backend
type: entity
updated: 2026-04-16
---

# EIFAVPN Backend

> [!key-insight] Кросс-проектная ссылка
> Полная документация бэкенда находится в отдельной wiki: `eifavpn-backend/wiki/`
> Путь: `C:/Users/aafek/OneDrive/Документы/GitHub/eifavpn-backend/wiki/`

## Обзор

Django 6.x REST API для VPN-сервиса. 3 приложения: accounts, api, subscriptions.

## Django Apps

| App | Назначение | Ключевые views |
|-----|-----------|---------------|
| **accounts** | User, Subscription, Referral, EmailVerification | SendCode, VerifyCode, Login, Me, LinkEmail/TG |
| **api** | OAuth callbacks, Remnawave proxy | google_login/callback, telegram_login/callback, proxy_view |
| **subscriptions** | Планы, покупки, webhooks, уведомления | Plans, Purchase, MySubscription, Trial, webhook_stars/crypto/wata |

## API Endpoints (используемые фронтендом)

### Auth (`/api/auth/`)
- `POST send-code/`, `verify-code/`, `register/`, `login/`, `logout/`
- `GET/PATCH me/`, `POST change-password/`, `delete-account/`
- `POST link-email/`, `link-email/verify/`, `link-telegram/`
- `GET link-google/` (redirect)

### Subscriptions (`/api/subscriptions/`)
- `GET plans/`, `my/`, `rates/`, `devices/`
- `POST purchase/`, `trial/`, `trial-upgrade/`, `validate-promo/`, `activate-gift/`
- `DELETE devices/`

### Referrals (`/api/referral/`)
- `GET my/`, `list/`
- `POST prepare-share/`

### Proxy (`/api/proxy/`)
- `GET nodes`, `hwid-user-devices/{uuid}`
- `GET users/{uuid}`

### Admin (`/api/admin/`)
- 30+ endpoints для админ-панели

## Внешние сервисы

- **Remnawave** (wavepanel.eifastore.ru) — VPN panel CRUD
- **CryptoPay** — крипто-платежи
- **Wata H2H** — карты/СБП
- **Telegram Stars** — Stars-платежи
- **Telegram Bot API** — уведомления
- **Google OAuth** — аутентификация
- **SMTP** (smtp.timeweb.ru) — email-коды

## См. также

- Бэкенд wiki: overview, Accounts App, Subscriptions App, API App
- [[API Client Architecture]] — Как фронтенд обращается к бэкенду
