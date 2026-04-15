---
title: API Auth Module
type: source
updated: 2026-04-16
file: src/api/auth.js
---

# API Auth Module

Модуль аутентификации — 15+ функций для работы с учётными записями.

## Функции

### Аутентификация
| Функция | Метод | Endpoint | Назначение |
|---------|-------|----------|------------|
| `sendCode(email)` | POST | `/auth/send-code/` | Отправить 6-значный код на email |
| `verifyCode({email, code, password?, name?, referral_code?})` | POST | `/auth/verify-code/` | Верифицировать код (логин/регистрация) |
| `register({email, password, name, referral_code})` | POST | `/auth/register/` | Legacy регистрация |
| `login({email, password})` | POST | `/auth/login/` | Email + пароль |
| `getMe()` | GET | `/auth/me/` | Текущий профиль |
| `logout(refresh)` | POST | `/auth/logout/` | Blacklist refresh token |

### Профиль
| Функция | Метод | Endpoint | Назначение |
|---------|-------|----------|------------|
| `updateProfile(data)` | PATCH | `/auth/me/` | Изменить имя/аватар |
| `changePassword({old, new})` | POST | `/auth/change-password/` | Смена пароля |
| `deleteAccount(password)` | POST | `/auth/delete-account/` | Удаление аккаунта |

### Привязка аккаунтов
| Функция | Метод | Endpoint | Назначение |
|---------|-------|----------|------------|
| `linkEmail(email)` | POST | `/auth/link-email/` | Привязать email (для TG-пользователей) |
| `linkEmailVerify({email, code})` | POST | `/auth/link-email/verify/` | Подтвердить привязку email |
| `linkTelegram(initData)` | POST | `/auth/link-telegram/` | Привязать Telegram через initData |
| `linkTelegramOidc(idToken)` | POST | `/auth/link-telegram-oidc/` | Привязать Telegram через OIDC |
| `linkTelegramWidget(widgetData)` | POST | `/auth/link-telegram-widget/` | Привязать через виджет |

### Merge аккаунтов
| Функция | Метод | Endpoint | Назначение |
|---------|-------|----------|------------|
| `mergeAccountPreview(secondaryUserId)` | POST | `/auth/merge-preview/` | Превью объединения |
| `mergeAccountConfirm(mergeToken)` | POST | `/auth/merge-confirm/` | Подтвердить объединение |

## Связь с бэкендом

Каждая функция вызывает соответствующий view в [[Accounts App]] бэкенда:
- `sendCode` → `SendCodeView`
- `verifyCode` → `VerifyCodeView`
- `login` → `LoginView`
- `getMe` → `MeView`

## См. также

- [[API Client Architecture]] — HTTP-клиент
- [[Authentication Flow Frontend]] — Полный flow аутентификации
- [[Auth Store]] — Zustand state management
- Бэкенд: [[Accounts App]], [[Authentication Flows]]
