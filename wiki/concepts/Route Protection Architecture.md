---
title: Route Protection Architecture
type: concept
status: developing
created: 2026-04-16
updated: 2026-04-16
tags: [security, routing, auth]
sources: [src/components/auth/ProtectedRoute.jsx, src/components/auth/AdminRoute.jsx]
---

# Route Protection Architecture

Двухуровневая защита маршрутов: аутентификация (cabinet) и авторизация (admin).

## Уровни защиты

```
┌─────────────────────────────────────────────────────────┐
│                  App.jsx (Router)                        │
│                                                         │
│  Публичные маршруты (без защиты):                       │
│    /  /cabinet/login  /register  /terms  /app           │
│    /download/:platform  /connect                        │
│                                                         │
│  ProtectedRoute (isAuthenticated):                      │
│    /cabinet/*  — требует валидный JWT                   │
│                                                         │
│  AdminRoute (isAuthenticated + is_staff):               │
│    /admin/*   — требует JWT + user.is_staff === true   │
└─────────────────────────────────────────────────────────┘
```

## ProtectedRoute

**Файл**: `src/components/auth/ProtectedRoute.jsx`

Проверяет аутентификацию. Если tokens есть, но user ещё не загружен — показывает спиннер и вызывает `fetchMe()`.

```
┌─ ProtectedRoute ──────────────────────────────┐
│                                                │
│  !initialized || isLoading → <Spinner />       │
│                                                │
│  !isAuthenticated → Navigate /cabinet/login    │
│                     (с сохранением from)       │
│                                                │
│  isAuthenticated → children                    │
└────────────────────────────────────────────────┘
```

## AdminRoute

**Файл**: `src/components/auth/AdminRoute.jsx`

Расширяет ProtectedRoute проверкой `user.is_staff`. Не-staff пользователи перенаправляются в кабинет.

```
┌─ AdminRoute ──────────────────────────────────┐
│                                                │
│  !initialized || isLoading → <Spinner />       │
│                                                │
│  !isAuthenticated → Navigate /cabinet/login    │
│                                                │
│  !user.is_staff → Navigate /cabinet/overview   │
│                                                │
│  is_staff → children (AdminLayout)             │
└────────────────────────────────────────────────┘
```

## Почему два компонента

- **ProtectedRoute** не знает о ролях — только о наличии auth
- **AdminRoute** добавляет авторизацию — проверку `is_staff`
- Это чётко разделяет *аутентификацию* и *авторизацию*
- Если появятся новые роли (moderator, support), AdminRoute легко расширяется

## Взаимодействие с [[Auth Store]]

Оба guard-а используют Zustand [[Auth Store]]:
- `initialized` — предотвращает flash-redirect при загрузке
- `fetchMe()` — загружает user + проверяет валидность token
- `user.is_staff` — роль приходит из GET /auth/me/

## См. также

- [[Auth Store]] — Zustand store с user state
- [[Authentication Flow Frontend]] — 4 метода логина
- [[Layouts Architecture]] — Какие лейауты защищены
- [[Admin Panel Frontend]] — Маршруты админки
- [[Component Tree]] — Место в иерархии компонентов
