import { useState, useEffect } from 'react'
import { Button, Chip } from '@heroui/react'
import { useAuthStore } from '../../stores/authStore'
import { getMySubscription, activateTrial, purchaseTrialUpgrade } from '../../api/subscriptions'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../../components/cabinet/StatusBadge'
import { motion } from 'motion/react'

export default function Overview() {
  const { user, fetchMe } = useAuthStore()
  const navigate = useNavigate()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trialLoading, setTrialLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMySubscription()
      .then((data) => setSubscription(data.subscription))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const hasSubscription = !!subscription
  const isExpired = subscription && new Date(subscription.expires_at) < new Date()
  const canTrial = user && !user.used_trial && !user.has_subscription
  const canTrialUpgrade = user?.used_trial && !user?.used_trial_upgrade && (!subscription || isExpired)

  async function handleActivateTrial() {
    setTrialLoading(true)
    setError(null)
    try {
      const result = await activateTrial()
      if (result.success) {
        await fetchMe()
        const data = await getMySubscription()
        setSubscription(data.subscription)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setTrialLoading(false)
    }
  }

  async function handleTrialUpgrade() {
    setTrialLoading(true)
    setError(null)
    try {
      const result = await purchaseTrialUpgrade('stars')
      if (result.payment_url) {
        window.location.href = result.payment_url
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setTrialLoading(false)
    }
  }

  if (loading) {
    return <div className="text-muted">Загрузка...</div>
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Обзор</h1>

      {/* Trial banner — 3 days MAX free */}
      {canTrial && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/[0.08] to-surface/60 p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">
                Попробуйте MAX бесплатно!
              </p>
              <p className="mt-1 text-sm text-muted">
                3 дня полного доступа без оплаты. 14 серверов, 6 устройств, торренты.
              </p>
            </div>
            <Button
              size="lg"
              className="glow-cyan shrink-0 px-6 font-semibold"
              onPress={handleActivateTrial}
              isPending={trialLoading}
            >
              Активировать
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        </motion.div>
      )}

      {/* Trial upgrade banner — 7 days PRO for 1₽ */}
      {canTrialUpgrade && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-warning/20 bg-gradient-to-r from-warning/[0.06] to-surface/60 p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">
                Специальное предложение!
              </p>
              <p className="mt-1 text-sm text-muted">
                7 дней PRO за 1₽ — 10 серверов, блокировка рекламы, 4 устройства.
              </p>
            </div>
            <Button
              size="lg"
              className="shrink-0 bg-warning px-6 font-semibold text-warning-foreground"
              onPress={handleTrialUpgrade}
              isPending={trialLoading}
            >
              Оплатить 1₽
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        </motion.div>
      )}

      {/* Subscription info */}
      {hasSubscription && (
        <div className="rounded-2xl border border-white/[0.06] bg-surface/40 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  {subscription.plan_name}
                </h2>
                <StatusBadge status={isExpired ? 'EXPIRED' : 'ACTIVE'} />
                {subscription.price_paid === '0.00' && (
                  <Chip size="sm" className="bg-accent/12 text-[10px] font-bold text-accent">Триал</Chip>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">
                {isExpired
                  ? `Истекла ${new Date(subscription.expires_at).toLocaleDateString('ru')}`
                  : `Активна до ${new Date(subscription.expires_at).toLocaleDateString('ru')}`
                }
              </p>
            </div>
            {!isExpired && (
              <Button
                size="sm"
                variant="outline"
                onPress={() => navigate('/cabinet/purchase')}
              >
                Продлить
              </Button>
            )}
            {isExpired && !canTrialUpgrade && (
              <Button
                size="sm"
                className="glow-cyan font-semibold"
                onPress={() => navigate('/cabinet/purchase')}
              >
                Купить подписку
              </Button>
            )}
          </div>

          {/* Subscription URL */}
          {subscription.subscription_url && !isExpired && (
            <div className="mt-4 rounded-xl border border-white/[0.05] bg-surface/30 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">URL подписки</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-black/20 px-3 py-2 font-mono text-xs text-accent">
                  {subscription.subscription_url}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => {
                    navigator.clipboard.writeText(subscription.subscription_url)
                  }}
                >
                  Копировать
                </Button>
              </div>
              <p className="mt-2 text-[11px] text-muted/60">
                Добавьте этот URL в V2rayN, Hiddify, Streisand или другой VPN-клиент
              </p>
            </div>
          )}
        </div>
      )}

      {/* No subscription and no trial available */}
      {!hasSubscription && !canTrial && !canTrialUpgrade && (
        <div className="rounded-2xl border border-white/[0.06] bg-surface/40 p-6 text-center">
          <p className="text-muted">У вас нет активной подписки</p>
          <Button
            className="glow-cyan mt-4 font-semibold"
            onPress={() => navigate('/cabinet/purchase')}
          >
            Выбрать тариф
          </Button>
        </div>
      )}
    </div>
  )
}
