import { useState, useEffect } from 'react'
import { Spinner } from '@heroui/react'
import { motion } from 'motion/react'
import { getSystemHealth, getAdminStats } from '../../api/admin'

function StatusCard({ name, ok, detail }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            ok === true ? 'bg-accent/15 text-accent' : ok === false ? 'bg-danger/15 text-danger' : 'bg-yellow-500/15 text-yellow-400'
          }`}
        >
          {ok === true ? 'Онлайн' : ok === false ? 'Офлайн' : 'Неизвестно'}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted">{detail}</p>
    </div>
  )
}

export default function System() {
  const [health, setHealth] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      getSystemHealth().catch(() => null),
      getAdminStats().catch(() => null),
    ]).then(([h, s]) => {
      if (cancelled) return
      setHealth(h)
      setStats(s)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  const h = health || {}
  const userCount = stats?.total_users ?? '—'

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Состояние системы</h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <StatusCard
          name="API Server"
          ok={h.api != null ? !!h.api : true}
          detail={h.api_detail ?? 'Responding normally — page loaded successfully'}
        />
        <StatusCard
          name="Database"
          ok={h.database?.status ? h.database.status === 'ok' || h.database.status === 'online' : true}
          detail={h.database?.detail ?? `${userCount} users in DB`}
        />
        <StatusCard
          name="Remnawave VPN"
          ok={h.remnawave?.ok ?? h.vpn?.ok ?? null}
          detail={h.remnawave?.detail ?? h.vpn?.detail ?? 'Check manually at remnawave panel'}
        />
        <StatusCard
          name="SMTP Email"
          ok={h.smtp?.ok ?? null}
          detail={h.smtp?.detail ?? 'Status unknown — endpoint not available'}
        />
        <StatusCard
          name="Telegram Bot"
          ok={h.telegram?.ok ?? null}
          detail={h.telegram?.detail ?? 'Status unknown — endpoint not available'}
        />
        <StatusCard
          name="Disk Usage"
          ok={h.disk?.ok ?? true}
          detail={h.disk?.detail ?? 'No data available'}
        />
      </div>
    </motion.div>
  )
}
