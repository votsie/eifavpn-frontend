import { useState, useEffect } from 'react'
import { Button, Spinner } from '@heroui/react'
import { CircleCheck, CircleXmark } from '@gravity-ui/icons'
import { motion, AnimatePresence } from 'motion/react'
import { getPlans, purchase } from '../../api/subscriptions'
import { useAuthStore } from '../../stores/authStore'

const PERIODS = [
  { id: 1, label: '1 мес' },
  { id: 3, label: '3 мес' },
  { id: 6, label: '6 мес', badge: '-20%' },
  { id: 12, label: '12 мес', badge: '-35%' },
]

const PAYMENT_METHODS = [
  { id: 'stars', name: 'Telegram Stars', desc: 'Оплата в Telegram' },
  { id: 'crypto', name: 'Криптовалюта', desc: 'TON, USDT, BTC' },
  { id: 'wata', name: 'Карта', desc: 'Visa, MC, МИР' },
]

const FEATURES = [
  { key: 'servers', format: (v) => `${v} серверов` },
  { key: 'devices', format: (v) => `${v} устройств` },
  { key: 'unlimited_traffic', format: (v) => v ? 'Безлимит' : '100 ГБ/мес' },
  { key: 'adblock', format: () => 'Adblock', bool: true },
  { key: 'p2p', format: () => 'P2P', bool: true },
]

export default function Purchase() {
  const [plans, setPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [period, setPeriod] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('stars')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [plansLoading, setPlansLoading] = useState(true)
  const [plansError, setPlansError] = useState(null)
  const { user } = useAuthStore()

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch((err) => setPlansError(err.message || 'Ошибка загрузки тарифов'))
      .finally(() => setPlansLoading(false))
  }, [])

  const currentPlan = plans.find((p) => p.id === selectedPlan)
  const basePrice = currentPlan?.pricing?.[1] || 0
  const monthPrice = currentPlan?.pricing?.[period] || 0
  const totalPrice = monthPrice * period
  const hasReferral = !!user?.referred_by
  const discount = hasReferral ? Math.round(totalPrice * 0.1) : 0
  const finalPrice = totalPrice - discount

  async function handlePurchase() {
    setLoading(true)
    setError(null)
    try {
      const result = await purchase({ plan: selectedPlan, period, payment_method: paymentMethod })
      if (result.payment_url) window.location.href = result.payment_url
    } catch (err) {
      setError(err.message || 'Ошибка при создании платежа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl w-full space-y-5">
      <h1 className="font-heading text-xl font-bold text-foreground">Выбрать тариф</h1>

      {/* Plan cards with price */}
      {plansLoading && <div className="flex justify-center py-8"><Spinner size="lg" /></div>}
      {plansError && <p className="text-sm text-danger">{plansError}</p>}
      <div className="grid gap-3 sm:grid-cols-3">
        {plans.map((plan) => {
          const price = plan.pricing?.[period] || 0
          const isSelected = selectedPlan === plan.id
          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              aria-pressed={isSelected}
              className={`relative rounded-xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-accent bg-accent/[0.06]'
                  : 'border-border bg-surface hover:border-accent/20'
              }`}
            >
              {plan.id === 'pro' && (
                <span className="absolute -top-2 right-3 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                  Popular
                </span>
              )}
              <p className="font-heading text-base font-bold text-foreground">{plan.name}</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-heading text-2xl font-extrabold text-accent">{price}₽</span>
                <span className="text-xs text-muted">/мес</span>
              </div>
              <div className="mt-3 space-y-1">
                {FEATURES.map((feat) => {
                  const included = feat.bool ? plan[feat.key] : true
                  return (
                    <div key={feat.key} className="flex items-center gap-1.5 text-[11px]">
                      {included ? (
                        <CircleCheck className="h-3 w-3 shrink-0 text-accent" />
                      ) : (
                        <CircleXmark className="h-3 w-3 shrink-0 text-muted/30" />
                      )}
                      <span className={included ? 'text-foreground/80' : 'text-muted/40 line-through'}>
                        {feat.bool ? feat.format() : feat.format(plan[feat.key])}
                      </span>
                    </div>
                  )
                })}
              </div>
            </button>
          )
        })}
      </div>

      {/* Period + Payment in one row */}
      <div className="flex flex-wrap items-start gap-4">
        {/* Period */}
        <div className="flex-1">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Период</p>
          <div className="inline-flex gap-1 rounded-lg border border-border bg-surface p-1">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                aria-pressed={period === p.id}
                className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  period === p.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {p.label}
                {p.badge && period !== p.id && (
                  <span className="absolute -top-1.5 -right-1 text-[8px] font-bold text-accent">
                    {p.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Оплата</p>
          <div className="inline-flex gap-1 rounded-lg border border-border bg-surface p-1">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                aria-pressed={paymentMethod === m.id}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  paymentMethod === m.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
                title={m.desc}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
        <div>
          <div className="flex items-baseline gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${selectedPlan}-${period}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="font-heading text-2xl font-extrabold text-foreground"
              >
                {finalPrice}₽
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-muted">
              {period > 1 ? `за ${period} мес (${monthPrice}₽/мес)` : 'за 1 мес'}
            </span>
          </div>
          {period > 1 && basePrice !== monthPrice && (
            <p className="mt-0.5 text-xs text-muted">
              <span className="line-through">{basePrice * period}₽</span>
              <span className="ml-1.5 text-accent font-medium">-{Math.round((1 - monthPrice / basePrice) * 100)}%</span>
            </p>
          )}
          {hasReferral && discount > 0 && (
            <p className="mt-0.5 text-xs text-accent">Реферальная скидка: -{discount}₽</p>
          )}
        </div>

        <Button
          size="md"
          className="glow-cyan px-8 font-semibold"
          onPress={handlePurchase}
          isPending={loading}
        >
          Оплатить
        </Button>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}
