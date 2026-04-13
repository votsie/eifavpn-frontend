import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spinner, Button, Input } from '@heroui/react'
import { ArrowLeft } from '@gravity-ui/icons'
import { getAdminUser, updateAdminUser, extendUserSubscription } from '../../api/admin'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [extendDays, setExtendDays] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMsg, setActionMsg] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getAdminUser(id)
        if (!cancelled) setUser(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  async function handleExtend() {
    const days = parseInt(extendDays, 10)
    if (!days || days <= 0) return
    setActionLoading(true)
    setActionMsg(null)
    try {
      await extendUserSubscription(id, days)
      setActionMsg(`Extended by ${days} days`)
      setExtendDays('')
      const data = await getAdminUser(id)
      setUser(data)
    } catch (err) {
      setActionMsg(`Error: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleToggleActive() {
    if (!user) return
    setActionLoading(true)
    setActionMsg(null)
    try {
      const data = await updateAdminUser(id, { is_active: !user.is_active })
      setUser(data)
      setActionMsg(data.is_active ? 'User activated' : 'User deactivated')
    } catch (err) {
      setActionMsg(`Error: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="light" size="sm" onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center text-sm text-red-400">
          {error}
        </div>
      </div>
    )
  }

  const u = user || {}
  const subs = u.subscriptions || []

  return (
    <div className="space-y-4">
      <Button variant="light" size="sm" onClick={() => navigate('/admin/users')}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to users
      </Button>

      {/* Row 1: Profile + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Profile card */}
        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted">Profile</p>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/12 text-accent font-heading text-lg font-bold">
              {(u.name || u.email || '?')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-heading font-bold text-foreground">{u.name || '—'}</p>
              <p className="text-sm text-muted">{u.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted">ID:</span>{' '}
              <span className="text-foreground">{u.id}</span>
            </div>
            <div>
              <span className="text-muted">Telegram:</span>{' '}
              <span className="text-foreground">{u.telegram_id || '—'}</span>
            </div>
            <div>
              <span className="text-muted">Registered:</span>{' '}
              <span className="text-foreground">
                {u.registered_at ? new Date(u.registered_at).toLocaleDateString() : '—'}
              </span>
            </div>
            <div>
              <span className="text-muted">Active:</span>{' '}
              <span className={u.is_active ? 'text-green-500' : 'text-red-400'}>
                {u.is_active ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted">Subscription</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted">Plan</p>
              <p className="font-heading text-lg font-bold text-foreground">{u.plan || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Days Left</p>
              <p className="font-heading text-lg font-bold text-foreground">{u.days_left ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Status</p>
              <p className="font-heading text-lg font-bold text-foreground">{u.status || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Referrals</p>
              <p className="font-heading text-lg font-bold text-foreground">{u.referral_count ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Subscription History */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xs uppercase tracking-wider text-muted mb-3">Subscription History</p>
        {subs.length === 0 ? (
          <p className="text-sm text-muted py-4 text-center">No subscriptions</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium">Start</th>
                  <th className="pb-2 font-medium">End</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((sub, i) => (
                  <tr key={sub.id || i} className="border-b border-border/50">
                    <td className="py-2 text-foreground">{sub.plan || '—'}</td>
                    <td className="py-2 text-muted text-xs">
                      {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-2 text-muted text-xs">
                      {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-2 text-foreground">{sub.amount != null ? `${sub.amount} ₽` : '—'}</td>
                    <td className="py-2 text-xs">{sub.status || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row 3: Actions */}
      <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
        <p className="text-xs uppercase tracking-wider text-muted">Actions</p>

        {actionMsg && (
          <p className={`text-xs ${actionMsg.startsWith('Error') ? 'text-red-400' : 'text-green-500'}`}>
            {actionMsg}
          </p>
        )}

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-end gap-2">
            <Input
              type="number"
              size="sm"
              label="Days"
              placeholder="30"
              value={extendDays}
              onChange={(e) => setExtendDays(e.target.value)}
              classNames={{ inputWrapper: 'bg-surface border border-border w-24' }}
            />
            <Button
              size="sm"
              color="primary"
              isLoading={actionLoading}
              onClick={handleExtend}
            >
              Extend Sub
            </Button>
          </div>

          <Button
            size="sm"
            color={u.is_active ? 'danger' : 'success'}
            variant="flat"
            isLoading={actionLoading}
            onClick={handleToggleActive}
          >
            {u.is_active ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>
    </div>
  )
}
