import { useState, useEffect } from 'react'
import { Spinner } from '@heroui/react'
import { getAdminStats, getRegistrationChart, getRevenueChart } from '../../api/admin'

function KpiCard({ label, value, delta }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold text-foreground">{value}</p>
      {delta !== undefined && delta !== null && (
        <p className={`mt-0.5 text-xs font-medium ${delta >= 0 ? 'text-green-500' : 'text-red-400'}`}>
          {delta >= 0 ? '+' : ''}{delta} today
        </p>
      )}
    </div>
  )
}

function BarChart({ data, label }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-sm font-semibold text-foreground mb-3">{label}</p>
      <div className="flex items-end gap-[2px] h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 group relative">
            <div
              className="w-full rounded-sm bg-accent/70 hover:bg-accent transition-colors"
              style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? '2px' : '0' }}
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block rounded bg-foreground px-1.5 py-0.5 text-[10px] text-surface whitespace-nowrap">
              {d.label}: {d.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlanBar({ name, percent }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs text-muted shrink-0">{name}</span>
      <div className="flex-1 h-3 rounded-full bg-border/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-accent/70 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs font-medium text-foreground w-10 text-right">{percent}%</span>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [regChart, setRegChart] = useState(null)
  const [revChart, setRevChart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [s, r, rv] = await Promise.all([
          getAdminStats(),
          getRegistrationChart(),
          getRevenueChart(),
        ])
        if (!cancelled) {
          setStats(s)
          setRegChart(r)
          setRevChart(rv)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  const s = stats || {}

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-xl font-bold text-foreground">Dashboard</h1>

      {/* KPI row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Users" value={s.total_users ?? '—'} delta={s.users_today} />
        <KpiCard label="Active Subs" value={s.active_subscriptions ?? '—'} />
        <KpiCard label="Revenue (month)" value={s.revenue_month != null ? `${s.revenue_month.toLocaleString()} ₽` : '—'} />
        <KpiCard label="MRR" value={s.mrr != null ? `${s.mrr.toLocaleString()} ₽` : '—'} />
      </div>

      {/* KPI row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <KpiCard label="Trial → Paid" value={s.trial_to_paid != null ? `${s.trial_to_paid}%` : '—'} />
        <KpiCard label="Avg Check" value={s.avg_check != null ? `${s.avg_check} ₽` : '—'} />
        <KpiCard label="Active Referrers" value={s.active_referrers ?? '—'} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {regChart && Array.isArray(regChart) && (
          <BarChart data={regChart} label="Registrations (30 days)" />
        )}
        {revChart && Array.isArray(revChart) && (
          <BarChart data={revChart} label="Revenue (30 days)" />
        )}
      </div>

      {/* Plan distribution */}
      {s.plan_distribution && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-foreground mb-3">Plan Distribution</p>
          <div className="space-y-2">
            {Object.entries(s.plan_distribution).map(([name, percent]) => (
              <PlanBar key={name} name={name} percent={percent} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
