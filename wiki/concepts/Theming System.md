---
title: Theming System
type: concept
updated: 2026-04-16
files: src/index.css, src/main.jsx
---

# Theming System

Двойная тема (light/dark) на CSS custom properties в пространстве oklch.

## Цветовые токены

### Light Theme
```css
--bg: oklch(0.99 0.002 240);
--surface: oklch(0.985 0.003 240);
--foreground: oklch(0.15 0.01 240);
--accent: oklch(0.42 0.18 195);
```

### Dark Theme
```css
--bg: oklch(0.11 0.012 260);
--surface: oklch(0.14 0.015 260);
--foreground: oklch(0.96 0.005 240);
--accent: oklch(0.78 0.17 180);
```

### Семантические токены
| Токен | Назначение |
|-------|-----------|
| `--bg` | Фон страницы |
| `--surface` | Фон карточек |
| `--overlay` | Модалки, popover |
| `--foreground` | Основной текст |
| `--muted` | Вторичный текст |
| `--accent` | Основной акцент (cyan/turquoise) |
| `--success` | Зелёный (ACTIVE) |
| `--danger` | Красный (EXPIRED, ошибки) |
| `--warning` | Жёлтый (LIMITED) |
| `--border` | Границы |
| `--separator` | Разделители |

## Переключение темы

### Settings.jsx
3 варианта: Light / Dark / Auto

```javascript
// При выборе
localStorage.setItem('eifavpn_theme', theme);
window.__eifavpnApplyTheme(theme);
```

### main.jsx: `__eifavpnApplyTheme()`
```javascript
function applyTheme(theme) {
  const resolved = theme === 'auto'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  document.documentElement.setAttribute('data-theme', resolved);
  document.documentElement.style.colorScheme = resolved;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}
```

### MutationObserver
Защищает от переопределения темы Telegram SDK. См. [[Telegram Mini App Integration]].

## Шрифты

| Шрифт | Назначение |
|-------|-----------|
| DM Sans | Основной текст (body) |
| Manrope | Заголовки |
| JetBrains Mono | Код, subscription URL |

Подключены через Google Fonts в `index.html`.

## Утилиты CSS

- `.glow` — Accent glow эффект
- `.animate-pulse-ring` — Пульсирующее кольцо
- `.animate-float` — Плавающая анимация
- Custom scrollbar styling
- `prefers-reduced-motion` — отключение анимаций

## См. также

- [[Telegram Mini App Integration]] — TG theme sync
- [[Layouts Architecture]] — Адаптивный дизайн
