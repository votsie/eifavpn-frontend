import { useState, useEffect, useCallback } from 'react'
import { Spinner, Input, Chip, Button } from '@heroui/react'
import { Magnifier } from '@gravity-ui/icons'
import { motion } from 'motion/react'
import { getAdminSubscriptions } from '../../api/admin'

const planFilters = ['All', 'Standard', 'Pro', 'Max']
const statusFilters = ['All', 'Active', 'Expired', 'Trial', 'Cancelled']
const methodFilters = ['All', 'Card', 'SBP', 'Crypto', 'Manual']

function planColor(plan) {
  switch (plan?.toLowerCase()) {
    case 'pro': return 'text-accent'
    case 'max': return 'text-warning'
    default: return 'text-foreground'
  }
}

function statusColor(status) {
  switch (status?.toLowerCase()) {
    case 'active': return 'success'
    case 'expired': return 'danger'
    case 'trial': return 'warning'
    case 'cancelled': return 'default'
    default: return 'default'
  }
}

export default function Subscriptions() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [methodFilter, setMethodFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchSubs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page }
      if (search) params.search = search
      if (planFilter !== 'All') params.plan = planFilter.toLowerCase()
      if (statusFilter !== 'All') params.status = statusFilter.toLowerCase()
      if (methodFilter !== 'All') params.method = methodFilter.toLowerCase()

      const data = await getAdminSubscriptions(params)
      if (data && typeof data === 'object') {
        setSubs(data.results ?? data.subscriptions ?? [])
        setTotalPages(data.total_pages ?? (Math.ceil((data.count ?? 0) / 20) || 1))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [search, planFilter, statusFilter, methodFilter, page])

  useEffect(() => {
    fetchSubs()
  }, [fetchSubs])

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Subscriptions</h1>

      {/* Search */}
      <Input
        placeholder="Search by user email..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        startContent={<Magnifier className="h-4 w-4 text-muted" />}
        classNames={{ inputWrapper: 'bg-surface border border-border' }}
      />

      {/* Plan filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-1">Plan:</span>
        {planFilters.map((f) => (
          <Chip
            key={f}
            variant={planFilter === f ? 'solid' : 'bordered'}
            color={planFilter === f ? 'primary' : 'default'}
            className="cursor-pointer text-xs"
            onClick={() => { setPlanFilter(f); setPage(1) }}
          >
            {f}
          </Chip>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-1">Status:</span>
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

      {/* Method filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-1">Method:</span>
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
                <th className="px-4 pb-2 pt-3 font-medium">User</th>
                <th className="px-4 pb-2 pt-3 font-medium">Plan</th>
                <th className="px-4 pb-2 pt-3 font-medium">Period</th>
                <th className="px-4 pb-2 pt-3 font-medium">Price</th>
                <th className="px-4 pb-2 pt-3 font-medium">Method</th>
                <th className="px-4 pb-2 pt-3 font-medium">Status</th>
                <th className="px-4 pb-2 pt-3 font-medium">Created</th>
                <th className="px-4 pb-2 pt-3 font-medium">Expires</th>
              </tr>
            </thead>
            <tbody>
              {subs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subs.map((sub, i) => (
                  <motion.tr
                    key={sub.id ?? i}
                    className="border-b border-border/50 hover:bg-surface/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <td className="px-4 py-3 text-muted text-xs">{sub.id ?? '—'}</td>
                    <td className="px-4 py-3 text-foreground">{sub.user_email ?? sub.user ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold uppercase ${planColor(sub.plan)}`}>
                        {sub.plan ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{sub.period ?? '—'}</td>
                    <td className="px-4 py-3 font-heading font-bold text-foreground">
                      {sub.price != null ? `${sub.price} ₽` : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">{sub.payment_method ?? sub.method ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Chip size="sm" color={statusColor(sub.status)} variant="flat">
                        {sub.status ?? '—'}
                      </Chip>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : '—'}
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
            Prev
          </Button>
          <span className="text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="flat"
            isDisabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </motion.div>
  )
}
