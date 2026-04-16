---
title: ErrorBoundary
type: entity
status: developing
created: 2026-04-16
updated: 2026-04-16
tags: [component, error-handling]
sources: [src/components/ErrorBoundary.jsx]
---

# ErrorBoundary

React class component для перехвата ошибок рендеринга. Оборачивает всё дерево Routes в [[App.jsx]].

## Поведение

```
Ошибка в любом дочернем компоненте
  │
  ├─ getDerivedStateFromError → hasError = true
  │
  ├─ componentDidCatch → console.error + componentStack
  │
  └─ Рендер:
     ┌──────────────────────────────────────┐
     │           Logo + "Что-то пошло      │
     │            не так"                   │
     │                                      │
     │        [Обновить страницу]           │
     └──────────────────────────────────────┘
```

## Зачем нужен

Без ErrorBoundary любая ошибка React рендеринга превращает весь сайт в белый экран. С ErrorBoundary пользователь видит понятное сообщение и кнопку перезагрузки.

## Расположение в дереве

```jsx
<ErrorBoundary>           ← ловит все ошибки
  <Suspense fallback>     ← lazy loading fallback
    <Routes>              ← маршруты
      ...
    </Routes>
  </Suspense>
</ErrorBoundary>
```

## См. также

- [[Component Tree]] — Место в иерархии
- [[Lazy Loading Architecture]] — Suspense работает вместе с ErrorBoundary
