---
title: Admin Panel Frontend
type: source
updated: 2026-04-16
file: src/layouts/AdminLayout.jsx + src/pages/admin/*
---

# Admin Panel Frontend

Админ-панель доступна по `/admin/*` для пользователей с `is_staff`.

## Навигация (14 маршрутов)

| Маршрут | Назначение | Иконка |
|---------|-----------|--------|
| `/admin` | Dashboard | ChartBar |
| `/admin/users` | Пользователи | Users |
| `/admin/subscriptions` | Подписки | CreditCard |
| `/admin/payments` | Платежи | Banknote |
| `/admin/referrals` | Рефералы | Share |
| `/admin/analytics` | Аналитика | TrendUp |
| `/admin/notifications` | Уведомления | Bell |
| `/admin/promo` | Промокоды | Tag |
| `/admin/audit` | Журнал аудита | Shield |
| `/admin/system` | Система | Server |
| `/admin/export` | Экспорт | Download |
| `/admin/pricing` | Ценообразование | Calculator |
| `/admin/settings` | Настройки | Gear |

## Layout

- Desktop: фиксированный sidebar (w-60) слева
- Mobile: горизонтальная навигация сверху
- Ссылка "Назад в кабинет" → `/cabinet`

## API

Все функции в [[API Admin Module]] (`src/api/admin.js`).

## Защита маршрутов

Админ-маршруты защищены [[AdminRoute]] — проверяет `isAuthenticated` + `user.is_staff`. Не-staff пользователи перенаправляются в `/cabinet/overview`. Подробнее: [[Route Protection Architecture]].

## Загрузка

Все admin-страницы загружаются через `React.lazy()` — код админки (~80 KB) не попадает в bundle обычных пользователей. См. [[Lazy Loading Architecture]].

## См. также

- [[API Admin Module]] — 30+ API-функций
- [[Layouts Architecture]] — AdminLayout
- [[Route Protection Architecture]] — AdminRoute guard
- [[Lazy Loading Architecture]] — Code splitting
