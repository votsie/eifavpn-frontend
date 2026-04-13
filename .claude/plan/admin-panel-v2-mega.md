# EIFAVPN Admin Panel v2 — 200+ Functions Mega Plan

## Architecture

**Already built (Phase 1-2):**
- Dashboard with KPI cards + bar charts
- Users table with search/filters/pagination
- User detail with subscription history + actions
- Backend: 8 API endpoints with IsAdminUser

**What needs to be built (Phase 3-6+):**
- 15+ new pages, 30+ new API endpoints, 200+ discrete functions

---

## Complete Module Map (17 modules, 200+ functions)

### MODULE 1: Dashboard (exists, needs enhancement)
**Page:** `/admin`

| # | Function | Type | Status |
|---|----------|------|--------|
| 1 | Total users KPI card | View | Done |
| 2 | Active subscriptions KPI | View | Done |
| 3 | Revenue this month KPI | View | Done |
| 4 | MRR estimate KPI | View | Done |
| 5 | Trial→Paid conversion rate | View | Done |
| 6 | Average check (ARPU) | View | Done |
| 7 | Active referrers count | View | Done |
| 8 | Registration chart (30 days) | View | Done |
| 9 | Revenue chart (30 days) | View | Done |
| 10 | Plan distribution bar | View | Done |
| 11 | Real-time activity feed | View | **New** |
| 12 | Churn rate card | View | **New** |
| 13 | Revenue comparison (this month vs last) | View | **New** |
| 14 | Top 5 referrers widget | View | **New** |
| 15 | Payment method distribution pie | View | **New** |
| 16 | New users today list | View | **New** |
| 17 | Expiring subscriptions (next 7 days) | View | **New** |
| 18 | Quick search (global) | Action | **New** |
| 19 | Quick actions panel (extend, notify) | Action | **New** |
| 20 | Server health status indicator | View | **New** |

### MODULE 2: Users Management (exists, needs enhancement)
**Page:** `/admin/users`

| # | Function | Type |
|---|----------|------|
| 21 | Paginated user list | View |
| 22 | Search by email | Filter |
| 23 | Search by Telegram ID | Filter |
| 24 | Search by name | Filter |
| 25 | Search by referral code | Filter |
| 26 | Filter by plan | Filter |
| 27 | Filter by subscription status | Filter |
| 28 | Filter by auth method (email/tg/google) | Filter |
| 29 | Filter by registration date range | Filter |
| 30 | Filter by trial usage | Filter |
| 31 | Sort by any column | Sort |
| 32 | Bulk select users (checkbox) | Action |
| 33 | Bulk extend subscription | Action |
| 34 | Bulk send notification | Action |
| 35 | Bulk activate/deactivate | Action |
| 36 | Export filtered users CSV | Export |
| 37 | Export filtered users JSON | Export |
| 38 | Column visibility toggle | View |
| 39 | Rows per page selector | View |
| 40 | Quick view user popup on hover | View |

### MODULE 3: User Detail (exists, needs enhancement)
**Page:** `/admin/users/:id`

| # | Function | Type |
|---|----------|------|
| 41 | Full profile display | View |
| 42 | Edit first_name | Edit |
| 43 | Edit email | Edit |
| 44 | Toggle is_active | Edit |
| 45 | Toggle is_staff | Edit |
| 46 | Reset used_trial flag | Edit |
| 47 | Reset used_trial_upgrade flag | Edit |
| 48 | Unlink Telegram ID | Edit |
| 49 | Unlink Google ID | Edit |
| 50 | Set/reset password | Edit |
| 51 | Add bonus days | Action |
| 52 | Create manual subscription | Action |
| 53 | Extend current subscription | Action |
| 54 | Cancel subscription | Action |
| 55 | Upgrade/downgrade plan | Action |
| 56 | View subscription history table | View |
| 57 | View payment history | View |
| 58 | View referral tree (who referred, who they referred) | View |
| 59 | View Remnawave live data (traffic, devices, last online) | View |
| 60 | View merge history | View |
| 61 | Send personal notification (email) | Action |
| 62 | Send personal notification (Telegram) | Action |
| 63 | View login activity / sessions | View |
| 64 | Impersonate user (login as) | Action |
| 65 | Delete user (soft delete) | Action |
| 66 | Restore soft-deleted user | Action |
| 67 | View user timeline (all events) | View |
| 68 | Add admin note to user | Edit |

### MODULE 4: Subscriptions Management
**Page:** `/admin/subscriptions`

| # | Function | Type |
|---|----------|------|
| 69 | Paginated subscription list | View |
| 70 | Filter by plan | Filter |
| 71 | Filter by status | Filter |
| 72 | Filter by payment method | Filter |
| 73 | Filter by date range | Filter |
| 74 | Filter by price range | Filter |
| 75 | Search by user email | Filter |
| 76 | Sort by any column | Sort |
| 77 | View subscription detail | View |
| 78 | Extend subscription | Action |
| 79 | Cancel subscription | Action |
| 80 | Mark as paid (manual) | Action |
| 81 | Change plan | Action |
| 82 | Change expiry date | Action |
| 83 | Bulk extend by filter | Action |
| 84 | Bulk cancel expired | Action |
| 85 | Export subscriptions CSV | Export |
| 86 | Subscription renewal rate metric | View |

### MODULE 5: Payments / Revenue
**Page:** `/admin/payments`

| # | Function | Type |
|---|----------|------|
| 87 | Payment transaction log | View |
| 88 | Filter by method (stars/crypto/wata) | Filter |
| 89 | Filter by status (paid/pending/failed) | Filter |
| 90 | Filter by date range | Filter |
| 91 | Filter by amount range | Filter |
| 92 | Search by payment_id | Filter |
| 93 | Revenue summary per period | View |
| 94 | Revenue by payment method chart | View |
| 95 | Average transaction value | View |
| 96 | Failed payment analysis | View |
| 97 | Refund capability | Action |
| 98 | Manual payment entry | Action |
| 99 | Payment reconciliation tool | View |
| 100 | Export payments CSV | Export |
| 101 | Daily/weekly/monthly revenue report | View |
| 102 | Year-over-year comparison | View |

### MODULE 6: Referral Management
**Page:** `/admin/referrals`

| # | Function | Type |
|---|----------|------|
| 103 | Referral list with referrer + referred | View |
| 104 | Top referrers leaderboard | View |
| 105 | Referral conversion rate (referred → paid) | View |
| 106 | Referral tree visualization | View |
| 107 | Total bonus days issued | View |
| 108 | Filter by bonus status | Filter |
| 109 | Filter by date range | Filter |
| 110 | Manually apply bonus | Action |
| 111 | Revoke bonus | Action |
| 112 | Referral chain depth analysis | View |
| 113 | Export referrals CSV | Export |

### MODULE 7: Analytics & Insights
**Page:** `/admin/analytics`

| # | Function | Type |
|---|----------|------|
| 114 | Registration trend (7/30/90 days) | View |
| 115 | Revenue trend (7/30/90 days) | View |
| 116 | Cohort retention analysis | View |
| 117 | Funnel: Visit→Register→Trial→Paid→Renew | View |
| 118 | Churn analysis by plan | View |
| 119 | Lifetime Value (LTV) by cohort | View |
| 120 | LTV by acquisition channel (email/tg/google) | View |
| 121 | User activity heatmap (by hour/day) | View |
| 122 | Plan migration flow (upgrades/downgrades) | View |
| 123 | MRR forecast (next 3 months) | View |
| 124 | Churn prediction (at-risk users) | View |
| 125 | Revenue forecast | View |
| 126 | Growth rate metrics | View |
| 127 | Average subscription duration | View |
| 128 | Trial-to-paid time analysis | View |
| 129 | Geographic distribution (TG language) | View |
| 130 | Device usage analysis (from Remnawave) | View |
| 131 | Popular VPN servers chart | View |
| 132 | Peak usage times | View |
| 133 | User segmentation (by value/activity) | View |

### MODULE 8: VPN Servers / Remnawave
**Page:** `/admin/servers`

| # | Function | Type |
|---|----------|------|
| 134 | Server list with status | View |
| 135 | Server online users count | View |
| 136 | Server health check (ping) | View |
| 137 | Total bandwidth usage | View |
| 138 | Server load distribution | View |
| 139 | Enable/disable server | Action |
| 140 | Per-server user count | View |
| 141 | Server response time monitoring | View |

### MODULE 9: Notifications / Messaging
**Page:** `/admin/notifications`

| # | Function | Type |
|---|----------|------|
| 142 | Send email to all users | Action |
| 143 | Send email to segment (by plan/status) | Action |
| 144 | Send Telegram message to all | Action |
| 145 | Send Telegram message to segment | Action |
| 146 | Notification templates CRUD | CRUD |
| 147 | Scheduled notifications | Action |
| 148 | Notification history log | View |
| 149 | Email delivery tracking | View |
| 150 | Telegram delivery tracking | View |
| 151 | Auto-notify: subscription expiring | Config |
| 152 | Auto-notify: trial ending | Config |
| 153 | Auto-notify: welcome message | Config |

### MODULE 10: Promo Codes
**Page:** `/admin/promo`

| # | Function | Type |
|---|----------|------|
| 154 | Create promo code | CRUD |
| 155 | Edit promo code | CRUD |
| 156 | Delete promo code | CRUD |
| 157 | Promo code list with usage stats | View |
| 158 | Filter by type (% discount / bonus days) | Filter |
| 159 | Filter by active/expired | Filter |
| 160 | Promo usage per user | View |
| 161 | Generate bulk promo codes | Action |
| 162 | Promo campaign analytics | View |
| 163 | Limit promo to specific plan | Config |
| 164 | Limit promo to specific user | Config |
| 165 | Promo code QR generator | Action |

### MODULE 11: Audit Log
**Page:** `/admin/audit`

| # | Function | Type |
|---|----------|------|
| 166 | Admin action log (who did what) | View |
| 167 | Filter by admin user | Filter |
| 168 | Filter by action type | Filter |
| 169 | Filter by date range | Filter |
| 170 | Account merge log viewer | View |
| 171 | Payment webhook event log | View |
| 172 | Failed login attempts | View |
| 173 | API error log | View |
| 174 | Export audit log CSV | Export |

### MODULE 12: System Health
**Page:** `/admin/system`

| # | Function | Type |
|---|----------|------|
| 175 | Remnawave API status | View |
| 176 | SMTP server status | View |
| 177 | Telegram Bot API status | View |
| 178 | Database stats (tables, rows) | View |
| 179 | Disk usage on server | View |
| 180 | Memory/CPU usage | View |
| 181 | Last deploy timestamp | View |
| 182 | Uptime monitoring | View |
| 183 | SSL certificate expiry | View |
| 184 | Background task queue status | View |

### MODULE 13: Export Center
**Page:** `/admin/export`

| # | Function | Type |
|---|----------|------|
| 185 | Export users CSV | Export |
| 186 | Export users JSON | Export |
| 187 | Export subscriptions CSV | Export |
| 188 | Export payments CSV | Export |
| 189 | Export referrals CSV | Export |
| 190 | Export analytics report PDF | Export |
| 191 | Scheduled auto-export | Config |
| 192 | Export history log | View |

### MODULE 14: Settings / Configuration
**Page:** `/admin/settings`

| # | Function | Type |
|---|----------|------|
| 193 | Edit plan pricing | Config |
| 194 | Edit plan features | Config |
| 195 | Edit referral bonus days | Config |
| 196 | Edit referral discount % | Config |
| 197 | Edit trial duration | Config |
| 198 | Maintenance mode toggle | Config |
| 199 | SMTP settings test | Config |
| 200 | Telegram bot test message | Config |

### MODULE 15: Bulk Operations
**Inside respective pages**

| # | Function | Type |
|---|----------|------|
| 201 | Bulk extend subscriptions | Action |
| 202 | Bulk send notifications | Action |
| 203 | Bulk activate/deactivate users | Action |
| 204 | Bulk delete expired subs | Action |
| 205 | Cleanup merged users (30d+) | Action |
| 206 | Bulk apply promo code | Action |
| 207 | Bulk export selected | Export |

### MODULE 16: Search / Global
**Header component**

| # | Function | Type |
|---|----------|------|
| 208 | Global search (Cmd+K) | Search |
| 209 | Search users by any field | Search |
| 210 | Search subscriptions | Search |
| 211 | Search payments by ID | Search |
| 212 | Recent searches history | View |

### MODULE 17: Predictions & AI-like features
**Inside Analytics page**

| # | Function | Type |
|---|----------|------|
| 213 | Churn risk scoring per user | Prediction |
| 214 | Revenue forecast (linear regression) | Prediction |
| 215 | Growth rate projection | Prediction |
| 216 | Best time to send notifications | Prediction |
| 217 | Optimal pricing suggestion | Prediction |
| 218 | User segment recommendations | Prediction |
| 219 | At-risk user list (expiring + inactive) | Prediction |
| 220 | Seasonal trend detection | Prediction |

---

## Implementation Phases

### Phase 3 — Subscriptions + Payments pages
**Files:** `admin/Subscriptions.jsx`, `admin/Payments.jsx`, backend endpoints
**Functions:** 69-102 (34 functions)

### Phase 4 — Analytics page (charts + metrics)
**Files:** `admin/Analytics.jsx`, backend chart/cohort endpoints
**Functions:** 114-133 (20 functions)

### Phase 5 — Referrals + Promo Codes
**Files:** `admin/Referrals.jsx`, `admin/Promo.jsx`, backend CRUD
**Functions:** 103-113, 154-165 (23 functions)

### Phase 6 — Notifications + Templates
**Files:** `admin/Notifications.jsx`, backend send/schedule
**Functions:** 142-153 (12 functions)

### Phase 7 — Audit + System Health + Export
**Files:** `admin/Audit.jsx`, `admin/System.jsx`, `admin/Export.jsx`
**Functions:** 166-192 (27 functions)

### Phase 8 — Settings + Bulk Ops + Global Search
**Files:** `admin/Settings.jsx`, search component, bulk actions
**Functions:** 193-212 (20 functions)

### Phase 9 — Dashboard enhancements + Predictions
**Files:** Dashboard.jsx enhancements, Analytics prediction widgets
**Functions:** 11-20, 213-220 (18 functions)

### Phase 10 — User Detail enhancements
**Files:** UserDetail.jsx full rewrite
**Functions:** 41-68 (28 remaining)

---

## Backend API Endpoints Needed

### Existing (8):
- `/api/admin/stats/` — KPI
- `/api/admin/stats/chart/registrations/` — Reg chart
- `/api/admin/stats/chart/revenue/` — Rev chart
- `/api/admin/users/` — User list
- `/api/admin/users/{id}/` — User detail
- `/api/admin/users/{id}/extend/` — Extend sub
- `/api/admin/subscriptions/` — Sub list
- `/api/admin/export/{type}/` — CSV export

### New (25+):
- `/api/admin/payments/` — Payment list
- `/api/admin/referrals/` — Referral list
- `/api/admin/analytics/cohorts/` — Cohort data
- `/api/admin/analytics/funnel/` — Funnel data
- `/api/admin/analytics/forecast/` — MRR forecast
- `/api/admin/analytics/churn/` — Churn analysis
- `/api/admin/analytics/segments/` — User segments
- `/api/admin/servers/` — Remnawave server list
- `/api/admin/notifications/send/` — Send notification
- `/api/admin/notifications/templates/` — Template CRUD
- `/api/admin/notifications/history/` — Send history
- `/api/admin/promo/` — Promo CRUD
- `/api/admin/promo/{id}/` — Promo detail
- `/api/admin/audit/` — Audit log
- `/api/admin/system/health/` — System health
- `/api/admin/settings/` — Settings CRUD
- `/api/admin/users/{id}/note/` — Add note
- `/api/admin/users/{id}/impersonate/` — Impersonate
- `/api/admin/users/{id}/timeline/` — User timeline
- `/api/admin/bulk/extend/` — Bulk extend
- `/api/admin/bulk/notify/` — Bulk notify
- `/api/admin/bulk/deactivate/` — Bulk deactivate
- `/api/admin/search/` — Global search
- `/api/admin/stats/activity-feed/` — Live events
- `/api/admin/stats/expiring/` — Expiring subs

## Frontend Routes

| Route | Page | Phase |
|-------|------|-------|
| `/admin` | Dashboard | Done |
| `/admin/users` | Users | Done |
| `/admin/users/:id` | User Detail | Done |
| `/admin/subscriptions` | Subscriptions | 3 |
| `/admin/payments` | Payments | 3 |
| `/admin/referrals` | Referrals | 5 |
| `/admin/analytics` | Analytics | 4 |
| `/admin/servers` | VPN Servers | 8 |
| `/admin/notifications` | Notifications | 6 |
| `/admin/promo` | Promo Codes | 5 |
| `/admin/audit` | Audit Log | 7 |
| `/admin/system` | System Health | 7 |
| `/admin/export` | Export Center | 7 |
| `/admin/settings` | Settings | 8 |

## Verification
Per phase: `npx vite build` 0 errors, API returns valid data, UI renders correctly.
