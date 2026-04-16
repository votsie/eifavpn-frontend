---
title: PromoInput
type: entity
status: developing
created: 2026-04-16
updated: 2026-04-16
tags: [component, promo, purchase]
sources: [src/components/PromoInput.jsx]
---

# PromoInput

Компонент ввода и валидации промокодов. Используется в [[Purchase.jsx]].

## Props

| Prop | Тип | Описание |
|------|-----|----------|
| `plan` | string | ID выбранного плана (standard/pro/max) |
| `period` | number | Период подписки (1/3/6/12 месяцев) |
| `onPromoApplied` | function | Callback: `(data \| null)` при применении/сбросе |
| `initialCode` | string | Предзаполненный код (из URL / localStorage / pending) |

## Поведение

```
┌───────────────────────────────────────┐
│  [   PROMO2025   ] [Применить]        │
│                                       │
│  → validatePromo({code, plan, period})│
│                                       │
│  ┌─ Success:                          │
│  │  onPromoApplied({                  │
│  │    code, promo_type, value,        │
│  │    description                     │
│  │  })                                │
│  │  Кнопка → "Убрать"                │
│  │                                    │
│  └─ Error:                            │
│     "Промокод недействителен"         │
│     onPromoApplied(null)              │
└───────────────────────────────────────┘
```

## Типы промокодов

| promo_type | Эффект | Пример |
|------------|--------|--------|
| `percent` | Скидка N% от цены | -20% |
| `days` | +N бонусных дней | +7 дней |
| `gift` | Бесплатная активация | Подарочный код |

## Auto-validation

Если передан `initialCode`, компонент автоматически валидирует его при монтировании. Источники initialCode:
1. URL `?promo=CODE`
2. `localStorage.eifavpn_promo`
3. `user.pending_promo_code`

## См. также

- [[Subscription Purchase Flow]] — Полный flow покупки
- [[API Subscriptions Module]] — validatePromo endpoint
- [[Cabinet Pages]] — Purchase.jsx
