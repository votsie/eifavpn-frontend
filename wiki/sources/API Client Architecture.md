---
title: API Client Architecture
type: source
updated: 2026-04-16
file: src/api/client.js
---

# API Client Architecture

Центральный HTTP-клиент приложения. Все API-вызовы проходят через `apiFetch()`.

## apiFetch(endpoint, options)

**Файл**: `src/api/client.js`

### Возможности

1. **Base URL**: `/api` (проксируется Vite dev server или nginx в продакшене)
2. **Auto Bearer Token**: Автоматически добавляет `Authorization: Bearer {access}` из localStorage
3. **Auto Token Refresh**: При 401 пытается обновить access token через refresh endpoint
4. **Error Wrapping**: Выбрасывает `ApiError` с полями `status` и `data`
5. **Response Unwrapping**: Если ответ содержит `.response`, возвращает вложенный объект
6. **Skip Auth**: Опция `skipAuth: true` для публичных эндпоинтов

### Класс ApiError

```javascript
class ApiError extends Error {
  constructor(status, data) {
    this.status = status;  // HTTP status code
    this.data = data;      // Raw response body
  }
}
```

### Поток обработки запроса

```
apiFetch(endpoint)
  │
  ├─ Добавить Bearer token (если есть)
  │
  ├─ fetch(`/api${endpoint}`, options)
  │
  ├─ Если 401 и есть refresh token:
  │   ├─ POST /api/auth/refresh/ с refresh token
  │   ├─ Сохранить новый access token
  │   └─ Повторить оригинальный запрос
  │
  ├─ Если ответ не OK → throw ApiError
  │
  └─ Распаковать response → return data
```

### Интеграция с authStore

- `setOnUnauthorized(callback)` — вызывается при финальном 401 (refresh тоже не сработал)
- authStore подписывается через этот callback для автоматического logout

## См. также

- [[Auth Store]] — Zustand store, использующий client
- [[API Auth Module]] — Эндпоинты аутентификации
- [[API Subscriptions Module]] — Эндпоинты подписок
- Бэкенд: [[JWT Authentication]] в eifavpn-backend wiki
