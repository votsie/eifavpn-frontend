---
title: CI/CD Frontend
type: domain
updated: 2026-04-16
files: .github/workflows/deploy-dev.yml, deploy-prod.yml
---

# CI/CD Frontend

GitHub Actions для автоматического деплоя.

## Pipelines

### deploy-dev.yml
- **Trigger**: Push to `dev`
- **Steps**:
  1. Checkout
  2. Setup Node 22
  3. `npm ci --legacy-peer-deps`
  4. `npm run build` (VITE_API_URL=https://dev.eifavpn.ru)
  5. SCP → `5.101.81.90:/opt/eifavpn/dev/frontend/`

### deploy-prod.yml
- **Trigger**: Push to `main`
- **Steps**: Аналогично dev, но:
  - VITE_API_URL=https://eifavpn.ru
  - Deploy → `/opt/eifavpn/prod/frontend/`

## Build Configuration

**Vite** (`vite.config.js`):
- React plugin с Oxc (быстрая компиляция)
- Tailwind CSS vite plugin
- Chunk splitting:
  - `vendor.js` — React, ReactDOM, React Router
  - `ui.js` — HeroUI, Motion
  - Остальное — page chunks
- Warning limit: 700KB per chunk

## Окружения

| Env | Branch | API URL | Deploy Path |
|-----|--------|---------|-------------|
| Dev | `dev` | https://dev.eifavpn.ru | /opt/eifavpn/dev/frontend/ |
| Prod | `main` | https://eifavpn.ru | /opt/eifavpn/prod/frontend/ |

Сервер: `5.101.81.90` (тот же, что и бэкенд).

## Секреты GitHub

- `SERVER_PASSWORD` — SSH пароль для SCP

## См. также

- Бэкенд: [[CI CD Pipeline]] — Backend deployment
- [[EIFAVPN Backend]] — Общая инфраструктура
