import { useState, useEffect, useCallback } from 'react'
import { Spinner, Chip, Button } from '@heroui/react'
import { motion } from 'motion/react'
import { getAdminReferrals } from '../../api/admin'

const bonusFilters = ['All', 'Applied', 'Pending']

export default function Referrals() {
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bonusFilter, setBonusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [summary, setSummary] = useState({ total_referrals: 0, bonus_days_issued: 0 })

  const fetchReferrals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page }
      if (bonusFilter === 'Applied') params.bonus_applied = 'true'
      if (bonusFilter === 'Pending') params.bonus_applied = 'false'

      const data = await getAdminReferrals(params)
      if (data && typeof data === 'object') {
        setReferrals(data.results ?? data.referrals ?? [])
        setTotalPages(data.total_pages ?? (Math.ceil((data.count ?? 0) / 20) || 1))
        setSummary({
          total_referrals: data.total_referrals ?? data.count ?? 0,
          bonus_days_issued: data.bonus_days_issued ?? 0,
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [bonusFilter, page])

  useEffect(() => {
    fetchReferrals()
  }, [fetchReferrals])

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Referrals</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Total Referrals</p>
          <p className="mt-1 font-heading text-2xl font-bold text-foreground">
            {summary.total_referrals}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Bonus Days Issued</p>
          <p className="mt-1 font-heading text-2xl font-bold text-accent">
            {summary.bonus_days_issued}
          </p>
        </div>
      </div>

      {/* Bonus filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-1">Bonus:</span>
        {bonusFilters.map((f) => (
          <Chip
            key={f}
            variant={bonusFilter === f ? 'solid' : 'bordered'}
            color={bonusFilter === f ? 'primary' : 'default'}
            className="cursor-pointer text-xs"
            onClick={() => { setBonusFilter(f); setPage(1) }}
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
                <th className="px-4 pb-2 pt-3 font-medium">Referrer</th>
                <th className="px-4 pb-2 pt-3 font-medium">Referred</th>
                <th className="px-4 pb-2 pt-3 font-medium">Date</th>
                <th className="px-4 pb-2 pt-3 font-medium">Subscription</th>
                <th className="px-4 pb-2 pt-3 font-medium">Bonus Applied</th>
              </tr>
            </thead>
            <tbody>
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No referrals found
                  </td>
                </tr>
              ) : (
                referrals.map((r, i) => (
                  <motion.tr
                    key={r.id ?? i}
                    className="border-b border-border/50 hover:bg-surface/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <td className="px-4 py-3 text-foreground">{r.referrer_email ?? r.referrer ?? '—'}</td>
                    <td className="px-4 py-3 text-foreground">{r.referred_email ?? r.referred ?? '—'}</td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">{r.subscription_plan ?? r.subscription ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Chip
                        size="sm"
                        color={r.bonus_applied ? 'success' : 'warning'}
                        variant="flat"
                      >
                        {r.bonus_applied ? 'Yes' : 'Pending'}
                      </Chip>
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
