import { useState, useEffect } from 'react'
import { Spinner } from '@heroui/react'
import { motion } from 'motion/react'
import { getAdminAuditLog } from '../../api/admin'

const TYPE_OPTIONS = ['all', 'admin_action', 'merge', 'payment', 'login_failed']
const TYPE_COLORS = {
  admin_action: 'bg-blue-500/15 text-blue-400',
  merge: 'bg-accent/15 text-accent',
  payment: 'bg-green-500/15 text-green-400',
  login_failed: 'bg-red-500/15 text-red-400',
  error: 'bg-red-500/15 text-red-400',
}

export default function Audit() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const params = { page }
    if (typeFilter !== 'all') params.type = typeFilter
    if (dateFrom) params.date_from = dateFrom
    if (dateTo) params.date_to = dateTo

    getAdminAuditLog(params)
      .then((data) => {
        if (cancelled) return
        const results = Array.isArray(data) ? data : data?.results ?? []
        setLogs(results)
        setTotalPages(data?.total_pages ?? (Math.ceil((data?.count ?? results.length) / 25) || 1))
      })
      .catch(() => {
        if (!cancelled) setError('Журнал действий пока недоступен')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [typeFilter, dateFrom, dateTo, page])

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Журнал действий</h1>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {TYPE_OPTIONS.map((t) => (
          <button
            key={t}
            onClick={() => { setTypeFilter(t); setPage(1) }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              typeFilter === t
                ? 'bg-accent/15 text-accent'
                : 'bg-surface border border-border text-muted hover:text-foreground'
            }`}
          >
            {t === 'all' ? 'All' : t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Date range */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted">С:</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        />
        <span className="text-xs text-muted">По:</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">{error}</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">Записей не найдено</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="rounded-xl border border-border bg-surface overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="px-4 py-3 font-medium">Дата</th>
                  <th className="px-4 py-3 font-medium">Тип</th>
                  <th className="px-4 py-3 font-medium">Пользователь</th>
                  <th className="px-4 py-3 font-medium">Действие</th>
                  <th className="px-4 py-3 font-medium">Детали</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <motion.tr
                    key={log.id ?? i}
                    className="border-b border-border/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : log.date ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TYPE_COLORS[log.type] ?? 'bg-border text-muted'}`}>
                        {log.type ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">{log.user ?? log.email ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-foreground">{log.action ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted max-w-[200px] truncate">{log.details ?? log.description ?? '—'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs text-muted">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
