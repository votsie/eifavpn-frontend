---
title: Subscription Purchase Flow
type: concept
updated: 2026-04-16
---

# Subscription Purchase Flow

Полный flow покупки подписки — от выбора плана до активации.

## Шаги

### 1. Выбор плана
**Страница**: `Purchase.jsx`

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Standard │ │   Pro    │ │   Max    │
│  69₽/мес │ │  99₽/мес │ │ 149₽/мес │
│ 3 devices│ │ 4 devices│ │ 6 devices│
│ 1TB      │ │ Unlim    │ │ Unlim+P2P│
└──────────┘ └──────────┘ └──────────┘
```

### 2. Выбор периода
```
[1 мес] [3 мес] [6 мес -20%] [12 мес -35%]
```

### 3. Промокод (опционально)
```
PromoInput → validatePromo({code, plan, period})
  ├─ percent: скидка %
  ├─ days: +N бонусных дней
  └─ gift: бесплатная активация
```

### 4. Способ оплаты
```
[⭐ Stars] [₿ Crypto] [💳 Карта]
```

### 5. Расчёт цены

```
base_price = PRICING[plan][period] × period_months

Скидки (стекаются):
  - Период: уже в базовой цене
  - Реферал: -10% (если есть referrer)
  - Промокод: -N% (если type=percent)

Конвертация:
  Stars: ceil(rub / 50 × 0.75 × star_rate × 1.15)
  Crypto: rub / rate × 1.03
  Card: rub (без наценки)
```

### 6. Отправка заказа

```
purchase({plan, period, payment_method, promo_code?, crypto_asset?})
  │
  └─ POST /api/subscriptions/purchase/
      │
      ├─ Бэкенд создаёт Subscription (status=pending)
      ├─ Генерирует invoice (Stars/CryptoPay/Wata)
      │
      └─ Возвращает: {payment_url, payment_id, subscription_id, ...}
```

### 7. Оплата

```
openPaymentUrl(payment_url)
  ├─ TG Mini App: Telegram.WebApp.openLink(url)
  └─ Browser: window.open(url) || window.location
```

### 8. Polling

```
После открытия URL оплаты:
  setInterval(5000) × 60 раз (= 5 минут)
    │
    └─ getMySubscription()
        ├─ Если status === 'paid' → показать ✅ + ConnectModal
        └─ Если timeout → показать "Оплата не подтверждена"
```

### 9. Webhook (на бэкенде)

```
Payment provider → webhook → process_payment_success(sub)
  ├─ Create/update Remnawave subscription
  ├─ sub.status = 'paid'
  ├─ Apply promo bonus days
  ├─ Apply referral bonus (+7 дней referrer)
  └─ Send Telegram notification
```

## Диаграмма

```
Frontend                Backend              External
────────               ─────────             ────────
purchase() ──────────▶ PurchaseView
                       create Subscription
                       create invoice ──────▶ Stars/Crypto/Wata
                       ◀───────── payment_url
openPaymentUrl() ────────────────────────────▶ Payment page
                                              User pays
                       webhook ◀──────────── Provider callback
                       process_payment()
                       update Remnawave ─────▶ Remnawave API
polling ─────────────▶ MySubscriptionView
                       ◀── status=paid
✅ Success!
```

## См. также

- [[Cabinet Pages]] — Purchase.jsx
- [[API Subscriptions Module]] — API функции
- Бэкенд: [[Subscription Lifecycle]], [[Payment Processing]]
