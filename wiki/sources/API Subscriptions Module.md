---
title: API Subscriptions Module
type: source
updated: 2026-04-16
file: src/api/subscriptions.js
---

# API Subscriptions Module

Модуль работы с подписками — планы, покупки, устройства, промокоды.

## Функции

### Планы и покупка
| Функция | Метод | Endpoint | Назначение |
|---------|-------|----------|------------|
| `getPlans()` | GET | `/subscriptions/plans/` | Список тарифов с ценами |
| `purchase({plan, period, payment_method, promo_code?, crypto_asset?})` | POST | `/subscriptions/purchase/` | Создать заказ |
| `getExchangeRates(amount)` | GET | `/subscriptions/rates/` | Курсы криптовалют |
| `activateTrial()` | POST | `/subscriptions/trial/` | 3-дневный trial (MAX) |
| `purchaseTrialUpgrade(payment_method)` | POST | `/subscriptions/trial-upgrade/` | 7 дней PRO за 1₽ |

### Подписка пользователя
| Функция | Метод | Endpoint | Назначение |
|---------|-------|----------|------------|
| `getMySubscription()` | GET | `/subscriptions/my/` | Текущая подписка + данные Remnawave |
| `getHwidDevices()` | GET | `/subscriptions/devices/` | Список устройств |
| `deleteHwidDevice(hwid)` | DELETE | `/subscriptions/devices/` | Отключить устройство |
| `getAccessibleNodes(uuid)` | GET | proxy → Remnawave | Список доступных серверов |

### Промокоды
| Функция | Метод | Endpoint | Назначение |
|---------|-------|----------|------------|
| `validatePromo({code, plan, period})` | POST | `/subscriptions/validate-promo/` | Валидация промокода |
| `activateGift(code)` | POST | `/subscriptions/activate-gift/` | Активация gift-кода |
| `getPromoInfo(code)` | GET | `/promo/info/` | Публичная информация о промо |
| `applyPendingPromo(code)` | POST | `/subscriptions/apply-promo/` | Применить отложенный промо |

## Ценовая формула

### Stars
```
stars = ceil(amount_rub / 50 * 0.75 * star_rate * 1.15)
```
- 50 Stars ≈ $0.75
- +15% наценка (комиссия TG)

### Crypto
```
crypto_amount = amount_rub / rate * 1.03
```
- +3% наценка

## См. также

- [[Subscription Purchase Flow]] — Полный flow покупки
- [[Cabinet Pages]] — Страницы кабинета
- Бэкенд: [[Subscriptions App]], [[Payment Processing]]
