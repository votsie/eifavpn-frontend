import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { apiFetch } from '../../api/client'

export default function Settings() {
  const [maintenance, setMaintenance] = useState(false)
  const [mLoading, setMLoading] = useState(false)
  const [mMsg, setMMsg] = useState(null)

  useEffect(() => {
    apiFetch('/admin/maintenance/').then(d => setMaintenance(d.maintenance)).catch(() => {})
  }, [])

  async function toggleMaintenance() {
    setMLoading(true)
    setMMsg(null)
    try {
      const res = await apiFetch('/admin/maintenance/', {
        method: 'POST',
        body: JSON.stringify({ enabled: !maintenance }),
      })
      setMaintenance(res.maintenance)
      setMMsg({ type: 'success', text: res.maintenance ? 'Режим обслуживания включён' : 'Режим обслуживания выключен' })
    } catch (err) {
      setMMsg({ type: 'error', text: err.message })
    } finally {
      setMLoading(false)
    }
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Настройки</h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {/* Maintenance Mode */}
        <div className={`rounded-xl border p-4 ${maintenance ? 'border-danger/30 bg-danger/[0.04]' : 'border-border bg-surface'}`}>
          <p className="text-sm font-semibold text-foreground">Режим обслуживания</p>
          <p className="mt-1 text-xs text-muted">
            Когда включён, все пользователи кроме администраторов видят страницу «Ведутся технические работы».
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={toggleMaintenance}
              disabled={mLoading}
              className={`relative h-6 w-11 rounded-full transition-colors ${maintenance ? 'bg-danger' : 'bg-border'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${maintenance ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-medium ${maintenance ? 'text-danger' : 'text-muted'}`}>
              {mLoading ? '...' : maintenance ? 'Включён' : 'Выключен'}
            </span>
          </div>
          {mMsg && (
            <p className={`mt-2 text-xs ${mMsg.type === 'success' ? 'text-accent' : 'text-danger'}`}>{mMsg.text}</p>
          )}
        </div>

        {/* Plans & Pricing */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-foreground">Планы и цены</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Standard</span>
              <span className="font-medium text-foreground">69 &#8381;/мес</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Pro</span>
              <span className="font-medium text-foreground">99 &#8381;/мес</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Max</span>
              <span className="font-medium text-foreground">149 &#8381;/мес</span>
            </div>
          </div>
        </div>

        {/* Referral Program */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-foreground">Реферальная программа</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Скидка</span>
              <span className="font-medium text-foreground">10%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Бонусные дни</span>
              <span className="font-medium text-foreground">7 дней</span>
            </div>
          </div>
        </div>

        {/* Trial Settings */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-foreground">Настройки триала</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Длительность</span>
              <span className="font-medium text-foreground">3 дня</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">План</span>
              <span className="font-medium text-foreground">MAX (free)</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
