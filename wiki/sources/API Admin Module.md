---
title: API Admin Module
type: source
updated: 2026-04-16
file: src/api/admin.js
---

# API Admin Module

Крупнейший API-модуль — 30+ функций для админ-панели.

## Категории

### Dashboard
| Функция | Endpoint | Назначение |
|---------|----------|------------|
| `getAdminStats()` | `/admin/stats/` | Общая статистика |
| `getRegistrationChart()` | `/admin/charts/registrations/` | График регистраций |
| `getRevenueChart()` | `/admin/charts/revenue/` | График выручки |
| `getActivityFeed()` | `/admin/activity/` | Лента активности |
| `getExpiringSubs()` | `/admin/expiring/` | Истекающие подписки |

### Пользователи
| Функция | Endpoint | Назначение |
|---------|----------|------------|
| `getAdminUsers(params)` | `/admin/users/` | Список (пагинация, поиск, фильтры) |
| `getAdminUser(id)` | `/admin/users/{id}/` | Детали пользователя |
| `updateAdminUser(id, data)` | `/admin/users/{id}/` | Редактирование |
| `extendUserSubscription(id, days)` | `/admin/users/{id}/extend/` | Продлить подписку |
| `getUserTimeline(id)` | `/admin/users/{id}/timeline/` | История действий |
| `getUserRemnawave(userId)` | `/admin/users/{id}/remnawave/` | Данные из Remnawave |
| `bulkExtend(userIds, days)` | `/admin/users/bulk-extend/` | Массовое продление |

### Подписки, платежи, рефералы
| Функция | Endpoint | Назначение |
|---------|----------|------------|
| `getAdminSubscriptions(params)` | `/admin/subscriptions/` | Все подписки |
| `manageSubscription(subId, data)` | `/admin/subscriptions/{id}/` | Управление подпиской |
| `getAdminPayments(params)` | `/admin/payments/` | Все платежи |
| `getAdminReferrals(params)` | `/admin/referrals/` | Все рефералы |

### Аналитика
| Функция | Endpoint | Назначение |
|---------|----------|------------|
| `getAnalyticsCohorts()` | `/admin/analytics/cohorts/` | Когортный анализ |
| `getAnalyticsFunnel()` | `/admin/analytics/funnel/` | Воронка конверсии |
| `getForecast()` | `/admin/analytics/forecast/` | Прогноз |

### Промокоды
| Функция | Endpoint | Назначение |
|---------|----------|------------|
| `getAdminPromos(params)` | `/admin/promos/` | Список промокодов |
| `createPromo(data)` | `/admin/promos/` | Создать промокод |
| `updatePromo(id, data)` | `/admin/promos/{id}/` | Обновить промокод |
| `deletePromo(id)` | `/admin/promos/{id}/` | Удалить промокод |

### Уведомления
| Функция | Endpoint | Назначение |
|---------|----------|------------|
| `sendBulkNotification(data)` | `/admin/notifications/bulk/` | Массовая рассылка |
| `sendNotification(data)` | `/admin/notifications/` | Индивидуальное уведомление |
| `getNotificationHistory(params)` | `/admin/notifications/history/` | История уведомлений |

### Система
| Функция | Endpoint | Назначение |
|---------|----------|------------|
| `getAdminAuditLog(params)` | `/admin/audit/` | Журнал действий |
| `getSystemHealth()` | `/admin/system/health/` | Здоровье системы |
| `getAdminSettings()` | `/admin/settings/` | Настройки |
| `updateAdminSettings(data)` | `/admin/settings/` | Обновить настройки |
| `globalSearch(query)` | `/admin/search/` | Глобальный поиск |

## См. также

- [[Admin Panel Frontend]] — Страницы админки
- Бэкенд: admin views в [[Subscriptions App]] и [[Accounts App]]
