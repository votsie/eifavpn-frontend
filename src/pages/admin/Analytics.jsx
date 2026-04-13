import { useState, useEffect } from 'react'
import { Spinner } from '@heroui/react'
import { motion } from 'motion/react'
import { getAnalyticsFunnel, getAnalyticsCohorts, getExpiringSubs, getForecast } from '../../api/admin'

function FunnelBar({ label, value, max, delay }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <span className="w-28 shrink-0 text-xs text-muted text-right">{label}</span>
      <div className="flex-1 h-7 rounded-full bg-border/30 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent/70"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: delay + 0.1 }}
        />
      </div>
      <span className="w-20 shrink-0 text-sm font-heading font-bold text-foreground">
        {value} <span className="text-xs font-normal text-muted">({pct.toFixed(1)}%)</span>
      </span>
    </motion.div>
  )
}

function retentionColor(value) {
  if (value == null) return ''
  if (value > 50) return 'bg-green-500/20 text-green-400'
  if (value >= 25) return 'bg-yellow-500/20 text-yellow-400'
  return 'bg-red-500/20 text-red-400'
}

export default function Analytics() {
  const [funnel, setFunnel] = useState(null)
  const [cohorts, setCohorts] = useState(null)
  const [expiring, setExpiring] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [f, c, e, fc] = await Promise.all([
          getAnalyticsFunnel(),
          getAnalyticsCohorts(),
          getExpiringSubs(),
          getForecast().catch(() => []),
        ])
        if (!cancelled) {
          setFunnel(f)
          setCohorts(c)
          setExpiring(e)
          setForecast(Array.isArray(fc) ? fc : fc?.data ?? [])
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
        <p className="text-sm text-danger">{error}</p>
      </div>
    )
  }

  const funnelData = funnel ?? {}
  const funnelSteps = [
    { label: 'Total Users', value: funnelData.total_users ?? 0 },
    { label: 'Used Trial', value: funnelData.used_trial ?? 0 },
    { label: 'Paid Once', value: funnelData.paid_once ?? 0 },
    { label: 'Active Now', value: funnelData.active_now ?? 0 },
  ]
  const funnelMax = funnelSteps[0].value || 1

  const cohortRows = Array.isArray(cohorts) ? cohorts : cohorts?.rows ?? []
  const expiringList = Array.isArray(expiring) ? expiring : expiring?.results ?? expiring?.users ?? []

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Analytics</h1>

      {/* Section 1: Conversion Funnel */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground mb-4">Conversion Funnel</p>
        <div className="space-y-3">
          {funnelSteps.map((step, i) => (
            <FunnelBar
              key={step.label}
              label={step.label}
              value={step.value}
              max={funnelMax}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>

      {/* Section 2: Cohort Retention */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground mb-4">Cohort Retention</p>
        {cohortRows.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">No cohort data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="px-3 pb-2 pt-1 font-medium">Month</th>
                  <th className="px-3 pb-2 pt-1 font-medium">Registered</th>
                  {cohortRows[0]?.retention?.map((_, i) => (
                    <th key={i} className="px-3 pb-2 pt-1 font-medium text-center">
                      {i + 1}m
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortRows.map((row, ri) => (
                  <motion.tr
                    key={row.month ?? ri}
                    className="border-b border-border/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: ri * 0.04 }}
                  >
                    <td className="px-3 py-2 text-foreground text-xs font-medium">{row.month ?? '—'}</td>
                    <td className="px-3 py-2 font-heading font-bold text-foreground">{row.registered ?? '—'}</td>
                    {row.retention?.map((val, ci) => (
                      <td key={ci} className="px-3 py-2 text-center">
                        {val != null ? (
                          <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${retentionColor(val)}`}>
                            {val}%
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 3: At-Risk Users */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground mb-4">
          At-Risk Users <span className="text-xs font-normal text-muted">(expiring in 7 days)</span>
        </p>
        {expiringList.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">No at-risk users</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="px-3 pb-2 pt-1 font-medium">User</th>
                  <th className="px-3 pb-2 pt-1 font-medium">Plan</th>
                  <th className="px-3 pb-2 pt-1 font-medium">Expires</th>
                  <th className="px-3 pb-2 pt-1 font-medium">Days Left</th>
                </tr>
              </thead>
              <tbody>
                {expiringList.map((u, i) => (
                  <motion.tr
                    key={u.id ?? i}
                    className="border-b border-border/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td className="px-3 py-2 text-foreground">{u.email ?? u.user ?? '—'}</td>
                    <td className="px-3 py-2 text-xs text-muted">{u.plan ?? '—'}</td>
                    <td className="px-3 py-2 text-xs text-muted">
                      {u.expires_at ? new Date(u.expires_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-3 py-2 font-heading font-bold text-warning">
                      {u.days_left ?? '—'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 4: MRR Forecast */}
      {forecast.length > 0 && (() => {
        const maxMrr = Math.max(...forecast.map((item) => item.mrr ?? 0), 1)
        return (
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm font-semibold text-foreground mb-4">MRR Forecast</p>
            <div className="flex items-end gap-[2px] h-40">
              {forecast.map((item, i) => (
                <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block rounded bg-foreground px-1.5 py-0.5 text-[10px] text-surface whitespace-nowrap z-10">
                    {item.month}: {(item.mrr ?? 0).toLocaleString()} ₽{item.forecast ? ' (forecast)' : ''}
                  </div>
                  <div
                    className={`w-full rounded-sm transition-colors ${item.forecast ? 'bg-accent/30 border border-dashed border-accent/40' : 'bg-accent/70 hover:bg-accent'}`}
                    style={{ height: `${((item.mrr ?? 0) / maxMrr) * 100}%`, minHeight: item.mrr > 0 ? '2px' : '0' }}
                  />
                  <p className="mt-1 text-center text-[8px] text-muted">{(item.month ?? '').slice(5)}</p>
                  <p className="text-center text-[7px] text-muted">{(item.mrr ?? 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-[10px] text-muted">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent/70" /> Actual
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-sm border border-dashed border-accent/40 bg-accent/30" /> Forecast
              </span>
            </div>
          </div>
        )
      })()}
    </motion.div>
  )
}
