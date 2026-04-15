---
title: Authentication Flow Frontend
type: concept
updated: 2026-04-16
---

# Authentication Flow (Frontend)

4 метода аутентификации, все сходятся к единому Zustand state.

## 1. Email + Code (основной)

```
LoginForm (state: 'email')
  │
  ├─ sendCode(email) → POST /auth/send-code/
  │   └─ Бэкенд отправляет 6-значный код на email
  │
  └─ LoginForm (state: 'code')
      │
      └─ verifyCode({email, code}) → POST /auth/verify-code/
          │
          ├─ Если пользователь новый: создаётся аккаунт
          ├─ Возвращает: {user, tokens, is_new}
          │
          └─ authStore.loginWithTokens(access, refresh)
              └─ fetchMe() → user state обновлён
```

## 2. Google OAuth

```
LoginForm → "Войти через Google"
  │
  ├─ window.location → /api/auth/google/?state={uuid}
  │   └─ Бэкенд redirect → Google OAuth
  │
  ├─ Google → callback → /api/auth/google/callback/?code=...
  │   └─ Бэкенд: exchange code → find/create user → tokens
  │
  └─ Redirect → /cabinet/login?access=...&refresh=...
      │
      └─ App.jsx: authStore.loginWithTokens(access, refresh)
```

**State validation**: UUID сохраняется в localStorage, проверяется при callback.

## 3. Telegram Login Widget

```
LoginForm → "Войти через Telegram"
  │
  ├─ useTelegramLogin(onAuth) → загружает TG Login SDK
  │
  └─ Пользователь авторизуется в виджете
      │
      ├─ Callback с {id, first_name, username, photo_url, hash}
      │
      └─ POST /api/auth/telegram/callback/ с id_token
          │
          └─ authStore.loginWithTokens(access, refresh)
```

## 4. Telegram Mini App (auto-login)

```
TelegramApp.jsx (маршрут /app)
  │
  ├─ Telegram.WebApp.initData → строка авторизации
  │
  └─ POST /api/auth/telegram-webapp/ {initData}
      │
      ├─ Бэкенд: validate HMAC → find/create user
      │
      └─ authStore.loginWithData(user, tokens)
          └─ Redirect → /cabinet (без fetchMe, данные уже есть)
```

## Защита маршрутов

```jsx
<ProtectedRoute>
  ├─ !initialized → <Spinner /> (ожидание fetchMe)
  ├─ !isAuthenticated → Navigate to /cabinet/login
  └─ isAuthenticated → <Outlet /> (контент кабинета)
</ProtectedRoute>
```

## Token Storage

- `localStorage.access` — JWT access token (1 день)
- `localStorage.refresh` — JWT refresh token (90 дней)
- Auto-refresh через [[API Client Architecture]] при 401

## См. также

- [[Auth Store]] — Zustand store
- [[API Auth Module]] — API функции
- Бэкенд: [[Authentication Flows]], [[Accounts App]]
