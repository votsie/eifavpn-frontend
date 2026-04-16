---
title: Wiki Index
updated: 2026-04-16
---

# EIFAVPN Frontend Wiki

> [!key-insight] Project Identity
> React 19 + Vite SPA для VPN-сервиса. Работает как сайт и Telegram Mini App. 4 метода аутентификации, 3 платёжных шлюза, адаптивный дизайн. Бэкенд: Django REST API ([[EIFAVPN Backend]]).

## Overview

- [[overview]] — Обзор проекта, стек, архитектура

## Sources (Модули)

- [[API Client Architecture]] — apiFetch(), auto-refresh, ApiError
- [[API Auth Module]] — 15+ функций аутентификации и привязки аккаунтов
- [[API Subscriptions Module]] — Планы, покупки, промокоды, устройства
- [[API Referrals Module]] — Реферальная программа (3 функции)
- [[API Admin Module]] — Админ-панель (30+ функций)
- [[Landing Pages]] — Hero, Features, Plans, Login, Register, Terms, Download, Connect
- [[Cabinet Pages]] — Overview, Purchase, Servers, Devices, Referral, Settings
- [[Admin Panel Frontend]] — 14 маршрутов админки

## Entities (Компоненты и модули)

- [[Auth Store]] — Zustand store (user, tokens, auth flow)
- [[Component Tree]] — Полное дерево React-компонентов
- [[Layouts Architecture]] — LandingLayout, CabinetLayout, AdminLayout
- [[ErrorBoundary]] — Перехват ошибок рендеринга, fallback UI
- [[PromoInput]] — Ввод/валидация промокодов (percent, days, gift)
- [[Remnawave Frontend]] — Интеграция с VPN-панелью через proxy
- [[EIFAVPN Backend]] — Кросс-ссылка на бэкенд (Django REST API)

## Concepts (Бизнес-логика и архитектура)

- [[Authentication Flow Frontend]] — Email code, Google, Telegram (4 варианта)
- [[Subscription Purchase Flow]] — Выбор плана → оплата → polling → активация
- [[Route Protection Architecture]] — ProtectedRoute (auth) + AdminRoute (staff)
- [[Lazy Loading Architecture]] — React.lazy() code splitting по маршрутам
- [[Telegram Mini App Integration]] — Среда, тема, auth, layout, share
- [[Theming System]] — Light/Dark/Auto, oklch tokens, MutationObserver
- [[VPN Connection Flow]] — ConnectModal → hiddify:// deep link → fallback
- [[Referral System Frontend]] — 10% скидка + 7 дней бонус, share механизмы

## Domains (Инфраструктура)

- [[CI CD Frontend]] — GitHub Actions (dev/prod), Vite build, chunk splitting
- [[Environment Variables Frontend]] — VITE_*, аналитика, .env.example
- [[API Endpoints Reference Frontend]] — Полный список 50+ вызываемых эндпоинтов

## Meta

- [[hot]] — Hot cache для быстрого старта сессии
- [[log]] — Лог всех ingests
