---
title: Telegram Mini App Integration
type: concept
updated: 2026-04-16
---

# Telegram Mini App Integration

Приложение работает как обычный сайт И как Telegram Mini App. Адаптация происходит на нескольких уровнях.

## Определение окружения

```javascript
// src/utils/telegram.js
function isTelegramWebApp() {
  return !!window.Telegram?.WebApp?.initData;
}
```

Используется для:
- Layout selection (mobile bottom nav vs desktop sidebar)
- Theme synchronization
- Payment URL opening method
- Share functionality
- Auth method (auto-login vs manual)

## Тема

**Файл**: `src/main.jsx`

### Приоритет определения:
1. Telegram WebApp colorScheme (`Telegram.WebApp.colorScheme`)
2. localStorage `eifavpn_theme`
3. System preference (`prefers-color-scheme`)

### MutationObserver Protection

Telegram SDK может переопределить тему документа. `main.jsx` устанавливает MutationObserver на `<html>`, чтобы предотвратить это:

```javascript
// Наблюдает за изменениями data-theme на <html>
// Если TG SDK меняет тему — восстанавливает выбранную пользователем
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme', 'class', 'style']
});
```

## Layout адаптация

### CabinetLayout
- **Desktop browser**: Sidebar (w-60) + Topbar
- **Mobile browser**: Bottom nav
- **Telegram Mini App**: Всегда bottom nav (даже на десктопе), без sidebar

### Topbar
- Desktop: приветствие + email + logout
- Mobile/TG: логотип + settings icon

## Авторизация

В TG Mini App — автоматический login через initData:
```
/app → TelegramApp.jsx
  ├─ Telegram.WebApp.initData
  └─ POST /auth/telegram-webapp/ → tokens → redirect /cabinet
```

## Оплата

```javascript
// src/utils/openPayment.js
function openPaymentUrl(url) {
  if (isTelegramWebApp()) {
    Telegram.WebApp.openLink(url); // In-app browser
  } else {
    window.open(url) || window.location.assign(url);
  }
}
```

## Share (реферальная ссылка)

```javascript
// В Referral.jsx
if (Telegram.WebApp.version >= '8.0') {
  Telegram.WebApp.shareMessage(preparedMessageId);
} else if (isTelegramWebApp()) {
  Telegram.WebApp.switchInlineQuery(referralCode);
} else {
  navigator.clipboard.writeText(referralLink);
}
```

## SDK загрузка

```html
<!-- index.html -->
<script src="https://telegram.org/js/telegram-web-app.js" async></script>
```

## Telegram Login Widget

**Файл**: `src/components/TelegramLoginWidget.jsx`
- Hook `useTelegramLogin(onAuth)` — lazy-загрузка Telegram Login SDK
- Bot ID: `8549019404`
- Возвращает: `{openTelegramLogin, sdkReady, loading, error}`

## См. также

- [[Theming System]] — Полная система тем
- [[Authentication Flow Frontend]] — TG Mini App auto-login
- [[Layouts Architecture]] — Адаптивный layout
- Бэкенд: [[Telegram Bot Integration]]
