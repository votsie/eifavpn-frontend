import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spinner, Button, Input } from '@heroui/react'
import { ArrowLeft } from '@gravity-ui/icons'
import { getAdminUser, updateAdminUser, extendUserSubscription, getUserTimeline, getAdminPayments, getUserRemnawave, manageSubscription } from '../../api/admin'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [payments, setPayments] = useState([])
  const [extendDays, setExtendDays] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMsg, setActionMsg] = useState(null)
  const [rmn, setRmn] = useState(null)
  const [vpnPlan, setVpnPlan] = useState('')
  const [vpnDevices, setVpnDevices] = useState('')
  const [vpnTrafficGB, setVpnTrafficGB] = useState('')
  const [vpnMsg, setVpnMsg] = useState(null)
  const [vpnLoading, setVpnLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [data, tl, pay, rmnData] = await Promise.all([
          getAdminUser(id),
          getUserTimeline(id).catch(() => []),
          getAdminPayments({ search: id }).catch(() => ({ results: [] })),
          getUserRemnawave(id).catch(() => null),
        ])
        if (!cancelled) {
          setUser(data)
          setTimeline(Array.isArray(tl) ? tl : tl?.events ?? [])
          setPayments(pay?.results ?? pay?.payments ?? [])
          setRmn(rmnData)
        }
        return
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
      setActionMsg(`Продлено на ${days} дн.`)
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
      setActionMsg(data.is_active ? 'Пользователь активирован' : 'Пользователь деактивирован')
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
          <ArrowLeft className="h-4 w-4 mr-1" /> Назад
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
        <ArrowLeft className="h-4 w-4 mr-1" /> К списку
      </Button>

      {/* Row 1: Profile + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Profile card */}
        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted">Профиль</p>
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
              <span className="text-muted">Регистрация:</span>{' '}
              <span className="text-foreground">
                {u.registered_at ? new Date(u.registered_at).toLocaleDateString() : '—'}
              </span>
            </div>
            <div>
              <span className="text-muted">Активен:</span>{' '}
              <span className={u.is_active ? 'text-green-500' : 'text-red-400'}>
                {u.is_active ? 'Да' : 'Нет'}
              </span>
            </div>
            <div>
              <span className="text-muted">Последний вход:</span>{' '}
              <span className="text-foreground">
                {u.last_login ? new Date(u.last_login).toLocaleString('ru-RU') : '—'}
              </span>
            </div>
            <div>
              <span className="text-muted">Email подтверждён:</span>{' '}
              <span className={u.email_verified ? 'text-green-500' : 'text-red-400'}>
                {u.email_verified ? 'Да' : 'Нет'}
              </span>
            </div>
            <div>
              <span className="text-muted">Приглашён:</span>{' '}
              <span className="text-foreground">{u.referred_by || '—'}</span>
            </div>
            <div>
              <span className="text-muted">Триал:</span>{' '}
              <span className="text-foreground">{u.used_trial ? 'Да' : 'Нет'}</span>
            </div>
            <div>
              <span className="text-muted">Апгрейд триала:</span>{' '}
              <span className="text-foreground">{u.used_trial_upgrade ? 'Да' : 'Нет'}</span>
            </div>
            <div>
              <span className="text-muted">Remnawave UUID:</span>{' '}
              <span className="text-foreground font-mono text-[10px]">{u.remnawave_uuid || '—'}</span>
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted">Подписка</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted">План</p>
              <p className="font-heading text-lg font-bold text-foreground">{u.plan || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Дней осталось</p>
              <p className="font-heading text-lg font-bold text-foreground">{u.days_left ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Статус</p>
              <p className="font-heading text-lg font-bold text-foreground">{u.status || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Рефералы</p>
              <p className="font-heading text-lg font-bold text-foreground">{u.referral_count ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Subscription History */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xs uppercase tracking-wider text-muted mb-3">История подписок</p>
        {subs.length === 0 ? (
          <p className="text-sm text-muted py-4 text-center">Нет подписок</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="pb-2 font-medium">План</th>
                  <th className="pb-2 font-medium">Начало</th>
                  <th className="pb-2 font-medium">Конец</th>
                  <th className="pb-2 font-medium">Сумма</th>
                  <th className="pb-2 font-medium">Статус</th>
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

      {/* VPN Management */}
      {user?.remnawave_uuid && (
        <div className="md:col-span-2 rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-foreground mb-4">Управление VPN</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Live data */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted">Remnawave данные</p>
              {rmn ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Статус</span>
                    <span className={rmn.status === 'ACTIVE' ? 'text-accent font-semibold' : 'text-danger font-semibold'}>{rmn.status}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted">Трафик</span>
                      <span className="text-foreground text-xs">
                        {((rmn.userTraffic?.usedTrafficBytes || rmn.usedTrafficBytes || 0) / 1073741824).toFixed(2)} ГБ
                        {(rmn.trafficLimitBytes || 0) > 0 ? ` / ${(rmn.trafficLimitBytes / 1073741824).toFixed(0)} ГБ` : ' / Безлимит'}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                      <div className="h-full rounded-full bg-accent/70" style={{
                        width: (rmn.trafficLimitBytes || 0) > 0
                          ? `${Math.min(100, ((rmn.userTraffic?.usedTrafficBytes || rmn.usedTrafficBytes || 0) / rmn.trafficLimitBytes) * 100)}%`
                          : '5%'
                      }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Устройства</span>
                    <span className="text-foreground">{rmn.hwidDeviceLimit || rmn.userTraffic?.hwidDeviceLimit || '?'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Последний онлайн</span>
                    <span className="text-foreground text-xs">{rmn.userTraffic?.onlineAt ? new Date(rmn.userTraffic.onlineAt).toLocaleString('ru-RU') : '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">UUID</span>
                    <span className="text-xs text-muted font-mono truncate max-w-[180px]" title={String(user.remnawave_uuid)}>{String(user.remnawave_uuid).slice(0, 12)}...</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted">Данные недоступны</p>
              )}
            </div>

            {/* Right: Actions */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted">Быстрые действия</p>

              {/* Extend */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" isDisabled={vpnLoading} onPress={async () => {
                  const subId = user.subscriptions?.find(s => s.status === 'paid')?.id
                  if (!subId) return setVpnMsg({ type: 'error', text: 'Нет активной подписки' })
                  setVpnLoading(true); setVpnMsg(null)
                  try { const r = await manageSubscription(subId, { action: 'extend', days: 7 }); setVpnMsg({ type: 'success', text: r.message }) } catch (e) { setVpnMsg({ type: 'error', text: e.message }) } finally { setVpnLoading(false) }
                }}>+7 дней</Button>
                <Button size="sm" variant="outline" isDisabled={vpnLoading} onPress={async () => {
                  const subId = user.subscriptions?.find(s => s.status === 'paid')?.id
                  if (!subId) return setVpnMsg({ type: 'error', text: 'Нет активной подписки' })
                  setVpnLoading(true); setVpnMsg(null)
                  try { const r = await manageSubscription(subId, { action: 'extend', days: 30 }); setVpnMsg({ type: 'success', text: r.message }) } catch (e) { setVpnMsg({ type: 'error', text: e.message }) } finally { setVpnLoading(false) }
                }}>+30 дней</Button>
              </div>

              {/* Plan change */}
              <div>
                <p className="text-xs text-muted mb-1">Сменить план</p>
                <div className="flex gap-1">
                  {['standard', 'pro', 'max'].map(p => (
                    <Button key={p} size="sm" variant={vpnPlan === p ? undefined : 'outline'} className="flex-1 text-xs" isDisabled={vpnLoading} onPress={async () => {
                      const subId = user.subscriptions?.find(s => s.status === 'paid')?.id
                      if (!subId) return setVpnMsg({ type: 'error', text: 'Нет активной подписки' })
                      setVpnLoading(true); setVpnMsg(null); setVpnPlan(p)
                      try { const r = await manageSubscription(subId, { action: 'change_plan', plan: p }); setVpnMsg({ type: 'success', text: r.message }) } catch (e) { setVpnMsg({ type: 'error', text: e.message }) } finally { setVpnLoading(false) }
                    }}>{p}</Button>
                  ))}
                </div>
              </div>

              {/* Device limit */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <p className="text-xs text-muted mb-1">Устройства</p>
                  <input type="number" min="1" max="20" value={vpnDevices} onChange={e => setVpnDevices(e.target.value)} placeholder="4" className="w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground" />
                </div>
                <Button size="sm" variant="outline" isDisabled={vpnLoading || !vpnDevices} onPress={async () => {
                  const subId = user.subscriptions?.find(s => s.status === 'paid')?.id
                  if (!subId) return
                  setVpnLoading(true); setVpnMsg(null)
                  try { const r = await manageSubscription(subId, { action: 'set_devices', device_limit: parseInt(vpnDevices) }); setVpnMsg({ type: 'success', text: r.message }) } catch (e) { setVpnMsg({ type: 'error', text: e.message }) } finally { setVpnLoading(false) }
                }}>OK</Button>
              </div>

              {/* Traffic limit */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <p className="text-xs text-muted mb-1">Трафик (ГБ, 0=безлимит)</p>
                  <input type="number" min="0" value={vpnTrafficGB} onChange={e => setVpnTrafficGB(e.target.value)} placeholder="0" className="w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground" />
                </div>
                <Button size="sm" variant="outline" isDisabled={vpnLoading} onPress={async () => {
                  const subId = user.subscriptions?.find(s => s.status === 'paid')?.id
                  if (!subId) return
                  setVpnLoading(true); setVpnMsg(null)
                  try { const r = await manageSubscription(subId, { action: 'set_traffic', traffic_bytes: parseInt(vpnTrafficGB || 0) * 1073741824 }); setVpnMsg({ type: 'success', text: r.message }) } catch (e) { setVpnMsg({ type: 'error', text: e.message }) } finally { setVpnLoading(false) }
                }}>OK</Button>
              </div>

              {/* Quick actions row */}
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" isDisabled={vpnLoading} onPress={async () => {
                  const subId = user.subscriptions?.find(s => s.status === 'paid')?.id
                  if (!subId) return
                  setVpnLoading(true); setVpnMsg(null)
                  try { const r = await manageSubscription(subId, { action: 'reset_traffic' }); setVpnMsg({ type: 'success', text: r.message }) } catch (e) { setVpnMsg({ type: 'error', text: e.message }) } finally { setVpnLoading(false) }
                }}>Сбросить трафик</Button>
                <Button size="sm" className="bg-accent text-accent-foreground" isDisabled={vpnLoading} onPress={async () => {
                  const subId = user.subscriptions?.find(s => s.status === 'paid')?.id
                  if (!subId) return
                  setVpnLoading(true); setVpnMsg(null)
                  try { const r = await manageSubscription(subId, { action: 'enable' }); setVpnMsg({ type: 'success', text: r.message }) } catch (e) { setVpnMsg({ type: 'error', text: e.message }) } finally { setVpnLoading(false) }
                }}>Включить</Button>
                <Button size="sm" color="danger" variant="outline" isDisabled={vpnLoading} onPress={async () => {
                  const subId = user.subscriptions?.find(s => s.status === 'paid')?.id
                  if (!subId) return
                  setVpnLoading(true); setVpnMsg(null)
                  try { const r = await manageSubscription(subId, { action: 'disable' }); setVpnMsg({ type: 'success', text: r.message }) } catch (e) { setVpnMsg({ type: 'error', text: e.message }) } finally { setVpnLoading(false) }
                }}>Отключить</Button>
              </div>

              {vpnMsg && (
                <p className={`text-xs ${vpnMsg.type === 'success' ? 'text-accent' : 'text-danger'}`}>{vpnMsg.text}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Row 3: User Timeline */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xs uppercase tracking-wider text-muted mb-3">Хронология</p>
        {timeline.length === 0 ? (
          <p className="text-sm text-muted py-4 text-center">Нет событий</p>
        ) : (
          <div className="space-y-0">
            {timeline.map((event, i) => {
              const colorByType = (t) => {
                if (t === 'registration') return 'bg-accent'
                if (t === 'subscription') return 'bg-green-500'
                if (t === 'referral') return 'bg-blue-500'
                if (t === 'merge') return 'bg-yellow-500'
                return 'bg-muted'
              }
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${colorByType(event.type)}`} />
                    {i < timeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-foreground">{event.description}</p>
                    <p className="text-xs text-muted">
                      {event.date ? new Date(event.date).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Row 3b: Payments */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xs uppercase tracking-wider text-muted mb-3">История платежей</p>
        {payments.length === 0 ? (
          <p className="text-sm text-muted py-4 text-center">Платежей нет</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="pb-2 font-medium">Дата</th>
                  <th className="pb-2 font-medium">Сумма</th>
                  <th className="pb-2 font-medium">Метод</th>
                  <th className="pb-2 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 10).map((pay, i) => (
                  <tr key={pay.id || i} className="border-b border-border/50">
                    <td className="py-2 text-muted text-xs">
                      {pay.created_at ? new Date(pay.created_at).toLocaleString('ru-RU') : '—'}
                    </td>
                    <td className="py-2 font-heading font-bold text-foreground">
                      {pay.amount != null ? `${pay.amount} ₽` : '—'}
                    </td>
                    <td className="py-2 text-muted text-xs">{pay.method ?? '—'}</td>
                    <td className="py-2 text-xs">{pay.status ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="flat" onClick={() => navigate('/admin/payments')}>
          Все платежи →
        </Button>
        <Button size="sm" variant="flat" onClick={() => navigate('/admin/subscriptions')}>
          Все подписки →
        </Button>
      </div>

      {/* Row 4: Actions */}
      <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
        <p className="text-xs uppercase tracking-wider text-muted">Действия</p>

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
              label="Дней"
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
              Продлить
            </Button>
          </div>

          <Button
            size="sm"
            color={u.is_active ? 'danger' : 'success'}
            variant="flat"
            isLoading={actionLoading}
            onClick={handleToggleActive}
          >
            {u.is_active ? 'Деактивировать' : 'Активировать'}
          </Button>
        </div>
      </div>
    </div>
  )
}
