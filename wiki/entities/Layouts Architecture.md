---
title: Layouts Architecture
type: entity
updated: 2026-04-16
files: src/layouts/LandingLayout.jsx, CabinetLayout.jsx, AdminLayout.jsx
---

# Layouts Architecture

3 лейаута для 3 зон приложения.

## LandingLayout

**Файл**: `src/layouts/LandingLayout.jsx`
**Зона**: Публичные страницы (`/`, `/cabinet/login`, `/register`, `/terms`)

```
┌──────────────────────────────────┐
│         <Background />           │
├──────────────────────────────────┤
│         <Navbar />               │
│  Logo  Features Plans Support    │
│                    🌙  Login  →  │
├──────────────────────────────────┤
│                                  │
│         <Outlet />               │
│    (Landing/Login/Register...)   │
│                                  │
├──────────────────────────────────┤
│         <Footer />               │
│  Logo    Terms  Support  ©2026   │
└──────────────────────────────────┘
```

## CabinetLayout

**Файл**: `src/layouts/CabinetLayout.jsx`
**Зона**: Личный кабинет (`/cabinet/*`)
**Адаптивность**: Desktop sidebar + Topbar / Mobile bottom nav

### Desktop (не Telegram)
```
┌──────────┬───────────────────────┐
│          │      <Topbar />       │
│ <Sidebar>│  Hi, user@email.com ⚙│
│  w-60    ├───────────────────────┤
│          │                       │
│ Overview │     <Outlet />        │
│ Purchase │                       │
│ Servers  │                       │
│ Devices  │                       │
│ Referral │                       │
│ Settings │                       │
│          │                       │
└──────────┴───────────────────────┘
```

### Mobile / Telegram Mini App
```
┌──────────────────────────────────┐
│  Logo              ⚙ (settings) │
├──────────────────────────────────┤
│                                  │
│           <Outlet />             │
│                                  │
├──────────────────────────────────┤
│  🏠  🛒  📱  👥  ⚙             │
│  Bottom Navigation Bar           │
│  (safe-area padding for iOS)     │
└──────────────────────────────────┘
```

**Логика определения**: `isTelegramWebApp()` → всегда mobile layout в TG.

## AdminLayout

**Файл**: `src/layouts/AdminLayout.jsx`
**Зона**: Админ-панель (`/admin/*`)

- Desktop: фиксированный sidebar w-60 с 14 ссылками
- Mobile: горизонтальная nav bar
- Ссылка "← Кабинет" внизу sidebar

## Защита маршрутов

| Layout | Guard | Проверка |
|--------|-------|----------|
| LandingLayout | Нет | Публичный |
| CabinetLayout | [[ProtectedRoute]] | isAuthenticated |
| AdminLayout | [[AdminRoute]] | isAuthenticated + is_staff |

Подробнее: [[Route Protection Architecture]]

## См. также

- [[Component Tree]] — Полная иерархия
- [[Telegram Mini App Integration]] — TG-адаптация layout
- [[Route Protection Architecture]] — Гарды маршрутов
- [[Lazy Loading Architecture]] — Страницы загружаются lazy
- [[Cabinet Pages]], [[Landing Pages]], [[Admin Panel Frontend]]
