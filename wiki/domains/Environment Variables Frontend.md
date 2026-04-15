---
title: Environment Variables Frontend
type: domain
updated: 2026-04-16
file: .env.example
---

# Environment Variables (Frontend)

## Vite Variables (доступны в клиентском коде)

| Переменная | Назначение | Пример |
|-----------|-----------|--------|
| `VITE_API_URL` | Base URL бэкенда | https://eifavpn.ru |
| `VITE_TELEGRAM_BOT_USERNAME` | Username TG бота | @EIFA_VPNbot |

## Server-only Variables (из .env.example)

| Переменная | Назначение |
|-----------|-----------|
| `REMNAWAVE_BEARER_TOKEN` | Admin token для Remnawave API |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token |
| `NEXT_PUBLIC_APP_URL` | Frontend URL для OAuth redirects |

> [!note] Несоответствие
> `.env.example` содержит серверные переменные (GOOGLE_CLIENT_SECRET, REMNAWAVE_BEARER_TOKEN), которые не должны попадать в клиентский код. Вероятно, этот файл предназначен для общего пользования с бэкендом или для локальной разработки.

## Аналитика (hardcoded в index.html)

| Сервис | ID |
|--------|----|
| Google Tag Manager | GTM-TXP4Z7WQ |
| Яндекс.Метрика | 108520192 |

## См. также

- [[CI CD Frontend]] — Как переменные передаются при build
- Бэкенд: [[Project Settings]] — Серверные переменные
