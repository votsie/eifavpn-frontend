import { useState, useEffect } from 'react'
import { Button, Chip, ProgressBar } from '@heroui/react'
import { useAuthStore } from '../../stores/authStore'
import { getMySubscription, activateTrial, purchaseTrialUpgrade } from '../../api/subscriptions'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../../components/cabinet/StatusBadge'
import ConnectModal from '../../components/cabinet/ConnectModal'
import { motion } from 'motion/react'

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 Б'
  const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 1 ? 2 : 0)} ${units[i]}`
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function daysLeft(iso) {
  if (!iso) return 0
  const diff = new Date(iso) - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="theme-card min-w-0 overflow-hidden rounded-xl border border-border bg-surface/30 p-3 md:p-4">
      <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted md:text-[11px]">{label}</p>
      <p className={`font-heading mt-1 truncate text-lg font-bold md:text-xl ${accent ? 'text-accent' : 'text-foreground'}`}>{value}</p>
      {sub && <p className="mt-0.5 truncate text-[10px] text-muted md:text-[11px]">{sub}</p>}
    </div>
  )
}

export default function Overview() {
  const { user, fetchMe } = useAuthStore()
  const navigate = useNavigate()
  const [sub, setSub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trialLoading, setTrialLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showConnect, setShowConnect] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const data = await getMySubscription()
      setSub(data.subscription)
    } catch {} finally {
      setLoading(false)
    }
  }

  const hasSub = !!sub
  const isExpired = sub && new Date(sub.expires_at) < new Date()
  const canTrial = user && !user.used_trial && !user.has_subscription
  const canTrialUpgrade = user?.used_trial && !user?.used_trial_upgrade && (!sub || isExpired)
  const rmn = sub?.remnawave
  const days = daysLeft(sub?.expires_at)

  // Traffic progress
  const trafficUsed = rmn?.used_traffic_bytes || 0
  const trafficLimit = rmn?.traffic_limit_bytes || sub?.plan_traffic_bytes || 0
  const trafficPercent = trafficLimit > 0 ? Math.min(100, (trafficUsed / trafficLimit) * 100) : 0
  const isUnlimited = trafficLimit === 0

  async function handleActivateTrial() {
    setTrialLoading(true); setError(null)
    try {
      const result = await activateTrial()
      if (result.success) { await fetchMe(); await loadData() }
    } catch (err) { setError(err.message) }
    finally { setTrialLoading(false) }
  }

  async function handleTrialUpgrade() {
    setTrialLoading(true); setError(null)
    try {
      const result = await purchaseTrialUpgrade('stars')
      if (result.payment_url) window.location.href = result.payment_url
    } catch (err) { setError(err.message) }
    finally { setTrialLoading(false) }
  }

  if (loading) return <div className="text-muted">Загрузка...</div>

  const paymentLabel = {
    trial: 'Триал (бесплатно)',
    stars: 'Telegram Stars',
    crypto: 'Криптовалюта',
    wata: 'Банковская карта',
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-3 overflow-hidden md:space-y-5">
      <h1 className="font-heading text-2xl font-bold text-foreground">Обзор</h1>

      {/* Trial banner */}
      {canTrial && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="theme-card-accent overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/[0.08] to-surface/60 p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">Попробуйте MAX бесплатно!</p>
              <p className="mt-1 text-sm text-muted">3 дня полного доступа. 14 серверов, 6 устройств, торренты.</p>
            </div>
            <Button size="lg" className="glow-cyan shrink-0 px-6 font-semibold" onPress={handleActivateTrial} isPending={trialLoading}>
              Активировать
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        </motion.div>
      )}

      {/* Trial upgrade banner */}
      {canTrialUpgrade && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="theme-card-accent overflow-hidden rounded-2xl border border-warning/20 bg-gradient-to-r from-warning/[0.06] to-surface/60 p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">Специальное предложение!</p>
              <p className="mt-1 text-sm text-muted">7 дней PRO за 1₽ — 10 серверов, блокировка рекламы.</p>
            </div>
            <Button size="lg" className="shrink-0 bg-warning px-6 font-semibold text-warning-foreground" onPress={handleTrialUpgrade} isPending={trialLoading}>
              Оплатить 1₽
            </Button>
          </div>
        </motion.div>
      )}

      {/* Subscription card */}
      {hasSub && (
        <div className="space-y-3 md:space-y-4">
          {/* Header */}
          <div className="theme-card flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-surface/40 p-4 md:p-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl font-bold text-foreground">{sub.plan_name}</h2>
                <StatusBadge status={isExpired ? 'EXPIRED' : (rmn?.status || 'ACTIVE')} />
                {sub.price_paid === '0.00' && <Chip size="sm" className="bg-accent/12 text-[10px] font-bold text-accent">Триал</Chip>}
              </div>
              <p className="mt-1 text-[13px] text-muted">
                {isExpired ? `Истекла ${formatDate(sub.expires_at)}` : `Активна до ${formatDate(sub.expires_at)}`}
              </p>
            </div>
            <div className="flex gap-2">
              {sub.subscription_url && !isExpired && (
                <Button size="sm" className="glow-cyan font-semibold" onPress={() => setShowConnect(true)}>
                  Подключиться
                </Button>
              )}
              <Button size="sm" variant={isExpired ? undefined : 'outline'} className={isExpired ? 'glow-cyan font-semibold' : ''} onPress={() => navigate('/cabinet/purchase')}>
                {isExpired ? 'Продлить' : 'Сменить план'}
              </Button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2 overflow-hidden md:gap-3 lg:grid-cols-4">
            <StatCard
              label="Осталось"
              value={isExpired ? 'Истекла' : `${days} дн.`}
              sub={`до ${formatDate(sub.expires_at)}`}
              accent={!isExpired && days <= 3}
            />
            <StatCard
              label="Оплата"
              value={sub.price_paid === '0.00' ? 'Бесплатно' : `₽${sub.price_paid}`}
              sub={paymentLabel[sub.payment_method] || sub.payment_method}
            />
            <StatCard
              label="Серверов"
              value={sub.plan_servers}
              sub={`до ${sub.plan_devices} устройств`}
            />
            <StatCard
              label="Дата покупки"
              value={formatDate(sub.created_at)}
            />
          </div>

          {/* Traffic */}
          <div className="theme-card rounded-2xl border border-border bg-surface/40 p-4 md:p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Трафик</p>
              <p className="text-sm text-muted">
                {formatBytes(trafficUsed)}
                {!isUnlimited && <span> / {formatBytes(trafficLimit)}</span>}
                {isUnlimited && <span className="ml-1 text-accent">Безлимит</span>}
              </p>
            </div>
            {!isUnlimited && (
              <ProgressBar
                value={trafficPercent}
                className="mt-3"
                aria-label="Использование трафика"
              />
            )}
            {isUnlimited && (
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-default">
                <div className="h-full rounded-full bg-accent/30" style={{ width: '100%' }} />
              </div>
            )}
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <p className="text-[11px] text-muted">Использовано</p>
                <p className="text-sm font-medium text-foreground">{formatBytes(trafficUsed)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Всего за всё время</p>
                <p className="text-sm font-medium text-foreground">{formatBytes(rmn?.lifetime_traffic_bytes)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Последний сброс</p>
                <p className="text-sm font-medium text-foreground">{formatDateTime(rmn?.last_traffic_reset_at)}</p>
              </div>
            </div>
          </div>

          {/* Connection info */}
          <div className="theme-card rounded-2xl border border-border bg-surface/40 p-4 md:p-5">
            <p className="mb-3 text-sm font-semibold text-foreground">Подключение</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-[11px] text-muted">Последний онлайн</p>
                <p className="text-sm font-medium text-foreground">
                  {rmn?.online_at ? formatDateTime(rmn.online_at) : 'Не подключался'}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Первое подключение</p>
                <p className="text-sm font-medium text-foreground">{formatDateTime(rmn?.first_connected_at)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Лимит устройств</p>
                <p className="text-sm font-medium text-foreground">
                  {rmn?.hwid_device_limit === 0 ? 'Без лимита' : `До ${rmn?.hwid_device_limit || sub.plan_devices}`}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-4 flex flex-wrap gap-2">
              {sub.plan_adblock && <Chip size="sm" className="bg-accent/10 text-[11px] text-accent">Блокировка рекламы</Chip>}
              {sub.plan_p2p && <Chip size="sm" className="bg-accent/10 text-[11px] text-accent">Торренты P2P</Chip>}
              <Chip size="sm" className="bg-default text-[11px] text-muted">AES-256</Chip>
              <Chip size="sm" className="bg-default text-[11px] text-muted">VLESS / TLS 1.3</Chip>
            </div>
          </div>

          {/* Subscription URL */}
          {sub.subscription_url && !isExpired && (
            <div className="theme-card-accent rounded-2xl border border-border bg-surface/40 p-4 md:p-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted md:text-[11px]">URL подписки</p>
              <div className="flex items-center gap-2">
                <code className="theme-code-bg min-h-11 flex-1 truncate rounded-lg px-3 py-2 font-mono text-xs text-accent">
                  {sub.subscription_url}
                </code>
                <Button size="sm" variant="outline" className="min-h-11" onPress={() => navigator.clipboard.writeText(sub.subscription_url)}>
                  Копировать
                </Button>
              </div>
              <p className="mt-2 text-[11px] text-muted">
                Добавьте этот URL в V2rayN, Hiddify или Streisand
              </p>
            </div>
          )}
        </div>
      )}

      {/* No subscription */}
      {!hasSub && !canTrial && !canTrialUpgrade && (
        <div className="theme-card rounded-2xl border border-border bg-surface/40 p-5 text-center md:p-6">
          <p className="text-muted">У вас нет активной подписки</p>
          <Button className="glow-cyan mt-4 font-semibold" onPress={() => navigate('/cabinet/purchase')}>
            Выбрать тариф
          </Button>
        </div>
      )}

      {sub?.subscription_url && (
        <ConnectModal
          isOpen={showConnect}
          onClose={() => setShowConnect(false)}
          subscriptionUrl={sub.subscription_url}
        />
      )}
    </div>
  )
}
