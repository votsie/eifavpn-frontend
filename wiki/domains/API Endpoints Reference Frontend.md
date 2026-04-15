---
title: API Endpoints Reference (Frontend View)
type: domain
updated: 2026-04-16
---

# API Endpoints Reference (Frontend View)

Все эндпоинты, вызываемые фронтендом. Base: `/api`.

## Auth (`/auth/`)

| Method | Endpoint | Auth | Frontend Function |
|--------|----------|------|------------------|
| POST | `/auth/send-code/` | No | `sendCode(email)` |
| POST | `/auth/verify-code/` | No | `verifyCode({...})` |
| POST | `/auth/register/` | No | `register({...})` |
| POST | `/auth/login/` | No | `login({email, password})` |
| POST | `/auth/refresh/` | No | (auto in client.js) |
| GET | `/auth/me/` | Yes | `getMe()` |
| PATCH | `/auth/me/` | Yes | `updateProfile(data)` |
| POST | `/auth/logout/` | Yes | `logout(refresh)` |
| POST | `/auth/change-password/` | Yes | `changePassword({...})` |
| POST | `/auth/delete-account/` | Yes | `deleteAccount(password)` |
| POST | `/auth/telegram-webapp/` | No | (TelegramApp.jsx) |
| POST | `/auth/link-email/` | Yes | `linkEmail(email)` |
| POST | `/auth/link-email/verify/` | Yes | `linkEmailVerify({...})` |
| POST | `/auth/link-telegram/` | Yes | `linkTelegram(initData)` |
| GET | `/auth/link-google/` | Yes | (form redirect) |
| POST | `/auth/merge-preview/` | Yes | `mergeAccountPreview(id)` |
| POST | `/auth/merge-confirm/` | Yes | `mergeAccountConfirm(token)` |

## OAuth Callbacks (`/`)

| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/auth/google/` | No | Redirect to Google |
| GET | `/auth/google/callback/` | No | Google callback → redirect with tokens |
| GET | `/auth/telegram/` | No | Redirect to Telegram |
| GET/POST | `/auth/telegram/callback/` | No | Telegram callback |

## Subscriptions (`/subscriptions/`)

| Method | Endpoint | Auth | Frontend Function |
|--------|----------|------|------------------|
| GET | `/subscriptions/plans/` | No | `getPlans()` |
| POST | `/subscriptions/purchase/` | Yes | `purchase({...})` |
| GET | `/subscriptions/my/` | Yes | `getMySubscription()` |
| GET | `/subscriptions/rates/` | Yes | `getExchangeRates(amount)` |
| POST | `/subscriptions/trial/` | Yes | `activateTrial()` |
| POST | `/subscriptions/trial-upgrade/` | Yes | `purchaseTrialUpgrade(method)` |
| GET | `/subscriptions/devices/` | Yes | `getHwidDevices()` |
| DELETE | `/subscriptions/devices/` | Yes | `deleteHwidDevice(hwid)` |
| POST | `/subscriptions/validate-promo/` | Yes | `validatePromo({...})` |
| POST | `/subscriptions/activate-gift/` | Yes | `activateGift(code)` |
| GET | `/promo/info/` | No | `getPromoInfo(code)` |

## Referrals (`/referral/`)

| Method | Endpoint | Auth | Frontend Function |
|--------|----------|------|------------------|
| GET | `/referral/my/` | Yes | `getReferralInfo()` |
| GET | `/referral/list/` | Yes | `getReferralList()` |
| POST | `/referral/prepare-share/` | Yes | `prepareShare()` |

## Proxy (`/proxy/`)

| Method | Endpoint | Auth | Frontend Usage |
|--------|----------|------|---------------|
| GET | `/proxy/nodes` | Yes | `getAccessibleNodes()` (Servers page) |
| GET | `/proxy/hwid-user-devices/{uuid}` | Yes | via `getHwidDevices()` |

## Admin (`/admin/`)

30+ endpoints. См. [[API Admin Module]].

## Maintenance

| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/maintenance/` | No | App.jsx checks on load |

## См. также

- [[API Client Architecture]] — HTTP-клиент
- Бэкенд: [[API Endpoints Reference]] — Полный серверный список
