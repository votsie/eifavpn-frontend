---
title: API Referrals Module
type: source
updated: 2026-04-16
file: src/api/referrals.js
---

# API Referrals Module

Модуль реферальной программы — 3 функции.

## Функции

| Функция | Метод | Endpoint | Назначение |
|---------|-------|----------|------------|
| `getReferralInfo()` | GET | `/referral/my/` | Статистика: code, link, bonus_days, total_referrals |
| `getReferralList()` | GET | `/referral/list/` | Список приведённых пользователей |
| `prepareShare()` | POST | `/referral/prepare-share/` | Подготовить Telegram inline share |

## Модель данных

### getReferralInfo Response
```json
{
  "code": "ABC12DEF",
  "link": "https://eifavpn.ru/register?ref=ABC12DEF",
  "total_referrals": 5,
  "bonus_days_earned": 35
}
```

### getReferralList Response
```json
[
  {
    "email": "ab***@gmail.com",
    "date": "2026-04-10",
    "subscribed": true
  }
]
```

## См. также

- [[Referral System]] — Концепция реферальной программы
- [[Cabinet Pages]] — Страница Referral
- Бэкенд: [[Referral System]], [[Accounts App]]
