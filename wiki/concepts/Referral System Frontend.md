---
title: Referral System Frontend
type: concept
updated: 2026-04-16
---

# Referral System (Frontend)

Реферальная программа: пригласи друга → друг получает скидку 10%, ты +7 дней.

## Поток

```
1. Пользователь копирует ссылку:
   https://eifavpn.ru/register?ref=ABC12DEF
   
2. Друг переходит → Register.jsx читает ?ref=
   
3. При регистрации: verifyCode({..., referral_code: 'ABC12DEF'})
   
4. При покупке друг получает -10% автоматически
   
5. Webhook → бэкенд начисляет +7 дней реферреру
```

## Share механизмы

### Telegram Mini App (8.0+)
```javascript
Telegram.WebApp.shareMessage(preparedMessageId)
```
`preparedMessageId` получается через `prepareShare()` → Telegram Bot API.

### Telegram Mini App (старые версии)
```javascript
Telegram.WebApp.switchInlineQuery(referralCode)
```
Открывает inline-бот для выбора чата.

### Браузер
```javascript
navigator.clipboard.writeText(referralLink)
```

## UI (Referral.jsx)

- Карточка с реферальной ссылкой (копировать / поделиться)
- Статистика: всего рефералов, бонусных дней
- Инструкция "Как это работает" (3 шага)
- Список приведённых пользователей (masked email + дата + статус)

## См. также

- [[API Referrals Module]] — API функции
- [[Cabinet Pages]] — Referral page
- Бэкенд: [[Referral System]]
