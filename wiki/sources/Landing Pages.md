---
title: Landing Pages
type: source
updated: 2026-04-16
files: src/pages/Landing.jsx, Hero.jsx, Features.jsx, Plans.jsx, Login.jsx, Register.jsx, Terms.jsx, Download.jsx, Connect.jsx
---

# Landing Pages

Публичные страницы, доступные без авторизации.

## Страницы

### Landing.jsx (`/`)
Композиция из 3 секций:
- [[Hero Section]] — Заголовок, CTA, статистика
- [[Features Section]] — 6 карточек преимуществ
- [[Plans Section]] — Тарифная сетка

### Hero.jsx
- **Заголовок**: "Интернет без границ"
- **Подзаголовок**: Протокол VLESS/TLS 1.3
- **CTA**: "Начать бесплатно" → `/register`
- **Статистика**: 14 серверов, 700+ пользователей, 0 логов
- **Анимация**: Scroll hint

### Features.jsx
6 карточек с иконками Gravity UI:
1. Молниеносная скорость (VLESS masquerade)
2. Шифрование TLS 1.3
3. Политика Zero Logs
4. 14 серверов по миру
5. Блокировка рекламы
6. Поддержка мультиустройств

Grid layout, hover-эффекты, accent highlight на первой карточке.

### Plans.jsx
- **Переключатель периодов**: 1/3/6/12 месяцев
- **Скидки**: -20% (6 мес), -35% (12 мес)
- **3 плана**: Standard, Pro (popular badge), Max
- **Фичи**: checklist (✓/✗) по каждому плану
- **CTA**: Кнопки "Выбрать" → `/register?plan={plan}`

### Login.jsx (`/cabinet/login`)
- Логотип + "Личный кабинет"
- Компонент [[LoginForm]]
- Glow-эффект фона
- Ссылка на Terms

### Register.jsx (`/register`)
- 2-шаговая регистрация
- OAuth кнопки (Google, Telegram)
- Поля: имя, email, пароль
- Реферальный код (из URL ?ref=)
- Шаг 2: верификация кода

### Terms.jsx (`/terms`)
- Общие условия (VLESS VPN)
- Правила использования
- Политика конфиденциальности (0 логов)
- Оплата и возврат (30 дней, <500MB)
- Контактная информация

### Download.jsx (`/download/:platform`)
Редирект на магазины приложений:
- Android → Google Play / APK
- iOS → App Store
- Windows/macOS/Linux → ссылки на Hiddify

### Connect.jsx (`/connect`)
Deep linking для VPN-подключения:
1. Получает URL из ?url= параметра
2. Генерирует `hiddify://import/{url}`
3. Автоматический редирект
4. Fallback через 2 секунды: кнопки retry, download, copy

### NotFound.jsx (`*`)
404 страница с ссылками на главную и кабинет.

## См. также

- [[Layouts Architecture]] — LandingLayout
- [[Authentication Flow Frontend]] — Login/Register flow
- [[VPN Connection Flow]] — Connect/Download pages
