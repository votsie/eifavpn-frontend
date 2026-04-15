---
title: Cabinet Pages
type: source
updated: 2026-04-16
files: src/pages/cabinet/Overview.jsx, Purchase.jsx, Servers.jsx, Devices.jsx, Referral.jsx, Settings.jsx
---

# Cabinet Pages

Защищённые страницы личного кабинета. Доступ через [[ProtectedRoute]].

## Страницы

### Overview.jsx (`/cabinet`)
Главная страница кабинета — информация о подписке.

**Секции:**
1. **Trial Banner** — 3 дня бесплатно (если не использован)
2. **Trial Upgrade** — PRO за 1₽ (7 дней, после trial)
3. **Subscription Card:**
   - План + статус badge + trial chip
   - Дата истечения
   - Статистика: дней осталось, цена, серверы, дата покупки
   - Прогресс-бар трафика (использовано/лимит)
   - Подключение: last online, first connected, device limit
   - Фичи: Adblock, P2P, AES-256, VLESS/TLS 1.3
4. **EIFASTORE promo** — ссылка на магазин
5. **ConnectModal** — подключение к VPN

### Purchase.jsx (`/cabinet/purchase`)
Страница покупки подписки.

**Компоненты:**
- **Plan selector**: 3 карточки (Standard, Pro, Max)
- **Period buttons**: 1/3/6/12 мес с badge скидок
- **Payment method**: Stars / Crypto / Card
- **PromoInput**: Ввод и валидация промокода
- **Crypto selector**: USDT/TON с live-курсами (+3%)
- **Stars calculation**: формула с +15% наценкой
- **Summary**: Итоговая цена, скидки, бонусы
- **Payment polling**: 5-минутный polling после оплаты

**Скидки (стекаются):**
- Период: % от базовой цены
- Реферал: 10%
- Промокод: % или дни

### Servers.jsx (`/cabinet/servers`)
Список VPN-серверов.

- Поиск по стране/имени
- Grid карточек:
  - Флаг + название страны (на русском)
  - Имя сервера
  - Статус online/offline
  - Кол-во пользователей онлайн
  - Badge "Текущий" для последнего подключения
- Gradient фон для текущего сервера
- Данные из `getAccessibleNodes(uuid)` через [[Remnawave Frontend|proxy]]

### Devices.jsx (`/cabinet/devices`)
Управление подключёнными устройствами.

- **Device limit card**: Visual icons (1-6 / unlimited)
- **Connected devices list**:
  - Имя устройства
  - HWID (truncated: 6 первых + 4 последних символа)
  - Дата первого подключения
- **Plan comparison**: Standard (3), Pro (4), Max (6)
- **Info callout**: Как работает лимит + кнопка upgrade

### Referral.jsx (`/cabinet/referral`)
Реферальная программа.

- **Referral link card**: копировать + поделиться
- **Stats**: Всего рефералов, бонусных дней
- **How it works**: 3-шаговая инструкция
- **Referred users list**: email + дата + статус подписки
- **Share options**:
  - TG 8.0+: `shareMessage()` (native share)
  - TG: `switchInlineQuery()` (inline bot)
  - Fallback: copy to clipboard

### Settings.jsx (`/cabinet/settings`)
Настройки аккаунта.

**Секции:**
1. Профиль: имя, аватар
2. Admin badge (для is_staff)
3. Привязанные аккаунты: Email, Google, Telegram
4. Реферальный код
5. Смена пароля
6. Тема: Light/Dark/Auto
7. Merge аккаунтов (при конфликтах)
8. Удаление аккаунта

**Потоки привязки:**
- Email: send code → verify
- Google: POST → redirect → callback
- Telegram: initData || widget auth
- Merge: preview → confirm (если провайдер уже привязан к другому аккаунту)

## См. также

- [[Layouts Architecture]] — CabinetLayout
- [[Subscription Purchase Flow]] — Детальный flow покупки
- [[VPN Connection Flow]] — ConnectModal
- [[Theming System]] — Theme selector в Settings
