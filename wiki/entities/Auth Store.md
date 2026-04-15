---
title: Auth Store
type: entity
updated: 2026-04-16
file: src/stores/authStore.js
---

# Auth Store (Zustand)

Центральное хранилище состояния аутентификации. Один store для всего приложения.

## State

| Поле | Тип | Описание |
|------|-----|----------|
| `user` | Object \| null | Текущий пользователь |
| `isAuthenticated` | boolean | Авторизован ли |
| `isLoading` | boolean | Загрузка (refresh/fetch) |
| `initialized` | boolean | Первичная загрузка завершена |
| `error` | string \| null | Сообщение об ошибке |

## Actions

### `login({email, password})`
- Вызывает `auth.login()`
- Сохраняет tokens в localStorage
- Устанавливает `user` и `isAuthenticated`

### `loginWithTokens(access, refresh)`
- Для OAuth callback (Google, Telegram)
- Сохраняет tokens → вызывает `fetchMe()`

### `loginWithData(user, tokens)`
- Для Telegram Mini App (данные уже получены)
- Прямая установка user + tokens

### `fetchMe()`
- GET `/auth/me/`
- Валидирует текущий token
- Обновляет user state

### `logout()`
- POST `/auth/logout/` с refresh token
- Очищает localStorage и state
- Сбрасывает `isAuthenticated = false`

### `clearError()`
- Сбрасывает `error = null`

## Инициализация

При старте приложения:
1. Проверяет наличие tokens в localStorage (синхронно)
2. Устанавливает `isAuthenticated = true` (предварительно, для предотвращения flash)
3. Вызывает `fetchMe()` для валидации
4. При 401 — сбрасывает через `setOnUnauthorized()` callback

## Интеграция с API Client

```
authStore ←→ api/client.js
  │                │
  │  setOnUnauthorized(callback)
  │       ↑
  │  При финальном 401:
  │  callback → authStore.logout()
  └────────────────┘
```

## Использование в компонентах

- [[ProtectedRoute]] — проверяет `isAuthenticated` и `initialized`
- [[LoginForm]] — вызывает `login()`, `loginWithTokens()`, `loginWithData()`
- [[Topbar]] — вызывает `logout()`
- [[Settings]] — использует `user` для отображения профиля

## См. также

- [[API Client Architecture]] — HTTP-клиент с auto-refresh
- [[Authentication Flow Frontend]] — Полный flow авторизации
