---
type: meta
title: "Dashboard"
updated: 2026-04-16
---

# Wiki Dashboard

## Recent Activity
```dataview
TABLE type, status, updated FROM "wiki" SORT updated DESC LIMIT 15
```

## Seed Pages (Need Development)
```dataview
LIST FROM "wiki" WHERE status = "seed" SORT updated ASC
```

## Entities Missing Sources
```dataview
LIST FROM "wiki/entities" WHERE !sources OR length(sources) = 0
```

## Open Questions
```dataview
LIST FROM "wiki/questions" WHERE answer_quality = "draft" SORT created DESC
```

## Cross-Reference Map

```
  ┌──── overview ────────────────────────────────────┐
  │                                                   │
  ▼                                                   ▼
Auth Flow ◄──► Auth Store ◄──► API Client Architecture
  │               │                    │
  ▼               ▼                    ▼
Route Protection   Component Tree   API Auth Module
  │                    │
  ▼                    ▼
Lazy Loading      Layouts Architecture
  │                    │
  ▼                    ▼
ErrorBoundary    Admin Panel Frontend
                       │
                       ▼
                 API Admin Module

Purchase Flow ◄──► PromoInput ◄──► API Subs Module
     │
     ▼
  Referral System
```
