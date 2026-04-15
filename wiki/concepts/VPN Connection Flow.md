---
title: VPN Connection Flow
type: concept
updated: 2026-04-16
---

# VPN Connection Flow

Подключение пользователя к VPN через deep link `hiddify://`.

## ConnectModal (5 шагов)

**Файл**: `src/components/cabinet/ConnectModal.jsx`

```
Шаг 1: Choice
  ├─ "Установить приложение" → Шаг 2
  └─ "Подключить VPN" → Шаг 4

Шаг 2: Device
  ├─ Телефон → Шаг 3
  ├─ Планшет → Шаг 3
  └─ Компьютер → Шаг 3

Шаг 3: Platform
  ├─ iOS / Android (телефон/планшет)
  └─ Windows / macOS / Linux (компьютер)
  → Показать ссылку на скачивание Hiddify

Шаг 4: Connect
  ├─ Попытка deep link: hiddify://import/{subscriptionUrl}
  ├─ В TG Mini App: Telegram.WebApp.openLink(hiddifyUrl)
  ├─ В браузере: window.location = hiddifyUrl
  └─ Если не открылось → Шаг 5

Шаг 5: Fallback
  ├─ Кнопка "Повторить"
  ├─ Кнопка "Скачать Hiddify"
  ├─ Кнопка "Скопировать ссылку"
  └─ Отображение subscription URL
```

## Deep Link формат

```
hiddify://import/https://wavepanel.eifastore.ru/sub/{shortUuid}
```

## Connect.jsx (standalone page)

**Маршрут**: `/connect?url={subscriptionUrl}`

Отдельная страница для deep linking (используется из email/TG уведомлений):
1. Извлекает URL из query параметра `?url=`
2. Генерирует `hiddify://import/{url}`
3. Авто-редирект
4. Через 2 сек — fallback UI: retry, download, copy

## Download.jsx

**Маршрут**: `/download/:platform`

Авто-редирект на магазин приложений:
- `android` → Google Play / APK
- `ios` → App Store
- `windows` / `macos` / `linux` → прямые ссылки Hiddify

## Device Limit Detection

ConnectModal проверяет лимит устройств перед подключением:
- Standard: 3 устройства
- Pro: 4 устройства
- Max: 6 устройств

Если лимит достигнут — предлагает отключить устройство в [[Cabinet Pages|Devices]] или перейти на план выше.

## См. также

- [[Cabinet Pages]] — Overview (ConnectModal), Devices
- [[Remnawave Frontend]] — subscription_url
- [[Telegram Mini App Integration]] — openLink в TG
