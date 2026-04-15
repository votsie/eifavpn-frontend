---
title: Remnawave Frontend Integration
type: entity
updated: 2026-04-16
---

# Remnawave Frontend Integration

Фронтенд не обращается к Remnawave напрямую — все запросы идут через [[Proxy System|backend proxy]] (`/api/proxy/*`).

## Данные из Remnawave

### Через MySubscription
`getMySubscription()` → бэкенд обращается к Remnawave и возвращает:
- `usedTrafficBytes` / `trafficLimitBytes` — использование трафика
- `lastConnectedAt` — последнее подключение
- `firstConnectedAt` — первое подключение
- `status` — ACTIVE/EXPIRED/DISABLED
- `subscription_url` — URL подписки для VPN-клиента

### Через Proxy (серверы)
`getAccessibleNodes(uuid)` → proxy → Remnawave `/nodes`:
- Список доступных серверов (страна, имя, IP)
- Статус online/offline
- Количество пользователей

### Через Proxy (устройства)
`getHwidDevices()` → proxy → Remnawave `/hwid-user-devices/`:
- Список подключённых устройств (HWID, имя)
- `deleteHwidDevice(hwid)` → удаление через proxy

## Subscription URL

Формат: `https://wavepanel.eifastore.ru/sub/{shortUuid}`
Используется для:
- Deep link `hiddify://import/{subscriptionUrl}`
- QR-код в ConnectModal
- Копирование в буфер

## См. также

- [[VPN Connection Flow]] — Подключение через hiddify://
- Бэкенд: [[Remnawave]], [[Remnawave Integration]], [[Proxy System]]
