import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner, Chip, Button, Input } from '@heroui/react'
import { Magnifier } from '@gravity-ui/icons'
import { motion } from 'motion/react'
import { getAdminPayments } from '../../api/admin'

const methodFilters = ['All', 'Card', 'SBP', 'Crypto', 'Manual']
const statusFilters = ['All', 'Succeeded', 'Pending', 'Failed', 'Refunded']

function statusColor(status) {
  switch (status?.toLowerCase()) {
    case 'succeeded': return 'success'
    case 'pending': return 'warning'
    case 'failed': return 'danger'
    case 'refunded': return 'default'
    default: return 'default'
  }
}

export default function Payments() {
  const navigate = useNavigate()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [summary, setSummary] = useState({ total_revenue: 0, count: 0 })

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page }
      if (search) params.search = search
      if (methodFilter !== 'All') params.method = methodFilter.toLowerCase()
      if (statusFilter !== 'All') params.status = statusFilter.toLowerCase()
      if (dateFrom) params.date_from = dateFrom
      if (dateTo) params.date_to = dateTo

      const data = await getAdminPayments(params)
      if (data && typeof data === 'object') {
        setPayments(data.results ?? data.payments ?? [])
        setTotalPages(data.total_pages ?? (Math.ceil((data.count ?? 0) / 20) || 1))
        setSummary({
          total_revenue: data.total_revenue ?? 0,
          count: data.count ?? (data.results ?? data.payments ?? []).length,
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [search, methodFilter, statusFilter, dateFrom, dateTo, page])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Платежи</h1>

      {/* Search */}
      <Input
        placeholder="Поиск по email..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        startContent={<Magnifier className="h-4 w-4 text-muted" />}
        classNames={{ inputWrapper: 'bg-surface border border-border' }}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Общая выручка</p>
          <p className="mt-1 font-heading text-2xl font-bold text-accent">
            {summary.total_revenue.toLocaleString()} ₽
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Транзакции</p>
          <p className="mt-1 font-heading text-2xl font-bold text-foreground">
            {summary.count}
          </p>
        </div>
      </div>

      {/* Method filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-1">Метод:</span>
        {methodFilters.map((f) => (
          <Chip
            key={f}
            variant={methodFilter === f ? 'solid' : 'bordered'}
            color={methodFilter === f ? 'primary' : 'default'}
            className="cursor-pointer text-xs"
            onClick={() => { setMethodFilter(f); setPage(1) }}
          >
            {f}
          </Chip>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-1">Статус:</span>
        {statusFilters.map((f) => (
          <Chip
            key={f}
            variant={statusFilter === f ? 'solid' : 'bordered'}
            color={statusFilter === f ? 'primary' : 'default'}
            className="cursor-pointer text-xs"
            onClick={() => { setStatusFilter(f); setPage(1) }}
          >
            {f}
          </Chip>
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

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="px-4 pb-2 pt-3 font-medium">ID</th>
                <th className="px-4 pb-2 pt-3 font-medium">Пользователь</th>
                <th className="px-4 pb-2 pt-3 font-medium">Сумма</th>
                <th className="px-4 pb-2 pt-3 font-medium">Метод</th>
                <th className="px-4 pb-2 pt-3 font-medium">ID платежа</th>
                <th className="px-4 pb-2 pt-3 font-medium">Статус</th>
                <th className="px-4 pb-2 pt-3 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    Платежи не найдены
                  </td>
                </tr>
              ) : (
                payments.map((p, i) => (
                  <motion.tr
                    key={p.id ?? i}
                    className="border-b border-border/50 hover:bg-surface/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <td className="px-4 py-3 text-muted text-xs">{p.id ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-foreground hover:text-accent cursor-pointer underline-offset-2 hover:underline"
                        onClick={(e) => { e.stopPropagation(); if (p.user_id) navigate(`/admin/users/${p.user_id}`) }}
                      >
                        {p.user_email ?? p.user ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-heading font-bold text-accent">
                      {p.amount != null ? `${p.amount} ₽` : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">{p.method ?? '—'}</td>
                    <td className="px-4 py-3 text-muted text-xs font-mono">{p.payment_id ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Chip size="sm" color={statusColor(p.status)} variant="flat">
                        {p.status ?? '—'}
                      </Chip>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {p.created_at ? new Date(p.created_at).toLocaleString('ru-RU') : '—'}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            size="sm"
            variant="flat"
            isDisabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Назад
          </Button>
          <span className="text-sm text-muted">
            Стр. {page} из {totalPages}
          </span>
          <Button
            size="sm"
            variant="flat"
            isDisabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Далее
          </Button>
        </div>
      )}
    </motion.div>
  )
}
