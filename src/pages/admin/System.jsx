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
  const userCount = h.database?.users_count ?? stats?.total_users ?? '—'

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Состояние системы</h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <StatusCard
          name="API Сервер"
          ok={h.api === 'online' || h.api != null ? true : null}
          detail="Работает нормально"
        />
        <StatusCard
          name="База данных"
          ok={h.database?.status === 'online' || h.database?.status === 'ok' ? true : h.database ? false : null}
          detail={`${userCount} пользователей в БД`}
        />
        <StatusCard
          name="Remnawave VPN"
          ok={h.remnawave === 'online' ? true : h.remnawave ? false : null}
          detail={h.remnawave === 'online' ? 'Панель Remnawave работает' : 'Проверьте панель Remnawave вручную'}
        />
        <StatusCard
          name="SMTP Почта"
          ok={h.smtp === 'configured' ? true : h.smtp ? false : null}
          detail={h.smtp === 'configured' ? 'Настроен (Gmail SMTP)' : 'Статус неизвестен'}
        />
        <StatusCard
          name="Telegram Бот"
          ok={h.telegram_bot?.status === 'online' ? true : h.telegram_bot ? false : null}
          detail={h.telegram_bot?.status === 'online' ? `Бот @${h.telegram_bot.bot} работает` : 'Статус неизвестен'}
        />
        <StatusCard
          name="Диск"
          ok={h.disk?.ok ?? true}
          detail={h.disk?.detail ?? 'Нет данных'}
        />
      </div>
    </motion.div>
  )
}
