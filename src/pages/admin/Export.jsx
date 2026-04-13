import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowDownToSquare } from '@gravity-ui/icons'

const EXPORTS = [
  { type: 'users', title: 'Пользователи', description: 'Экспорт всех пользователей в CSV' },
  { type: 'subscriptions', title: 'Подписки', description: 'Экспорт подписок в CSV' },
  { type: 'payments', title: 'Платежи', description: 'Экспорт платежей в CSV' },
  { type: 'referrals', title: 'Рефералы', description: 'Экспорт рефералов в CSV' },
]

export default function Export() {
  const [exportLoading, setExportLoading] = useState(null)
  const [exportError, setExportError] = useState(null)

  async function handleExport(type) {
    setExportLoading(type)
    setExportError(null)
    try {
      const token = localStorage.getItem('eifavpn_access')
      const res = await fetch(`/api/admin/export/${type}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `eifavpn-${type}-${new Date().toISOString().slice(0,10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setExportError(err.message)
    } finally {
      setExportLoading(null)
    }
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Экспорт данных</h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {EXPORTS.map((exp, i) => (
          <motion.div
            key={exp.type}
            className="rounded-xl border border-border bg-surface p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{exp.title}</p>
                <p className="mt-1 text-xs text-muted">{exp.description}</p>
                <p className="mt-2 text-[10px] text-muted">Нажмите для скачивания</p>
              </div>
              <ArrowDownToSquare className="h-5 w-5 shrink-0 text-muted" />
            </div>
            <button
              onClick={() => handleExport(exp.type)}
              disabled={exportLoading === exp.type}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-accent/15 px-4 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/25 disabled:opacity-50"
            >
              {exportLoading === exp.type ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              ) : (
                <ArrowDownToSquare className="h-3.5 w-3.5" />
              )}
              {exportLoading === exp.type ? 'Загрузка...' : 'Скачать CSV'}
            </button>
          </motion.div>
        ))}
      </div>

      {exportError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
          {exportError}
        </div>
      )}
    </motion.div>
  )
}
