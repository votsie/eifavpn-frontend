import { useState, useEffect } from 'react'
import { Button, Chip } from '@heroui/react'
import { CircleCheck, CircleXmark } from '@gravity-ui/icons'
import { motion, AnimatePresence } from 'motion/react'
import { getPlans, purchase } from '../../api/subscriptions'
import { useAuthStore } from '../../stores/authStore'

const PERIODS = [
  { id: 1, label: '1 мес', badge: null },
  { id: 3, label: '3 мес', badge: null },
  { id: 6, label: '6 мес', badge: '-20%' },
  { id: 12, label: '12 мес', badge: '-35%' },
]

const PAYMENT_METHODS = [
  {
    id: 'stars',
    name: 'Telegram Stars',
    icon: '⭐',
    desc: 'Оплата в Telegram',
  },
  {
    id: 'crypto',
    name: 'Криптовалюта',
    icon: '₿',
    desc: 'TON, USDT, BTC',
  },
  {
    id: 'wata',
    name: 'Банковская карта',
    icon: '💳',
    desc: 'Visa, MC, МИР',
  },
]

const FEATURE_LABELS = [
  { key: 'servers', format: (v) => `${v} серверов` },
  { key: 'devices', format: (v) => `До ${v} устройств` },
  { key: 'unlimited_traffic', format: (v) => v ? 'Безлимит трафика' : '100 ГБ/мес' },
  { key: 'adblock', format: () => 'Блокировщик рекламы', bool: true },
  { key: 'p2p', format: () => 'Торренты (P2P)', bool: true },
]

export default function Purchase() {
  const [plans, setPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [period, setPeriod] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('stars')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuthStore()

  useEffect(() => {
    getPlans().then(setPlans).catch(() => {})
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
      const result = await purchase({
        plan: selectedPlan,
        period,
        payment_method: paymentMethod,
      })
      if (result.payment_url) {
        window.location.href = result.payment_url
      }
    } catch (err) {
      setError(err.message || 'Ошибка при создании платежа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl w-full overflow-hidden">
      <h1 className="font-heading mb-2 text-2xl font-bold text-foreground">Выбрать тариф</h1>
      <p className="mb-6 text-sm text-muted md:mb-8">Выберите план, период и способ оплаты</p>

      {/* Step 1: Plan selection */}
      <div className="mb-6 md:mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">1. Тариф</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative min-h-11 rounded-2xl border p-4 text-left transition-all duration-200 md:p-5 ${
                selectedPlan === plan.id
                  ? 'theme-card-accent border-accent/30 bg-accent/[0.06]'
                  : 'theme-card border-border bg-surface/40 hover:border-accent/10'
              }`}
            >
              {plan.id === 'pro' && (
                <Chip size="sm" className="absolute -top-2 right-3 bg-accent/15 text-[10px] font-bold text-accent">
                  Популярный
                </Chip>
              )}
              <p className="font-heading text-lg font-bold text-foreground">{plan.name}</p>
              <div className="mt-3 space-y-1.5">
                {FEATURE_LABELS.map((feat) => {
                  const included = feat.bool ? plan[feat.key] : true
                  return (
                    <div key={feat.key} className="flex items-center gap-2 text-xs">
                      {included ? (
                        <CircleCheck className="h-3.5 w-3.5 text-accent/70" />
                      ) : (
                        <CircleXmark className="h-3.5 w-3.5 text-muted/30" />
                      )}
                      <span className={included ? 'text-foreground/80' : 'text-muted/40 line-through'}>
                        {feat.bool ? feat.format() : feat.format(plan[feat.key])}
                      </span>
                    </div>
                  )
                })}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Period */}
      <div className="mb-6 md:mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">2. Период</h2>
        <div className="theme-card inline-flex items-center gap-1 rounded-2xl border border-border bg-surface/40 p-1.5">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`relative min-h-11 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                period === p.id
                  ? 'bg-accent text-accent-foreground glow-cyan'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {p.label}
              {p.badge && period !== p.id && (
                <span className="absolute -top-2 -right-1 rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold text-accent">
                  {p.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Payment method */}
      <div className="mb-6 md:mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">3. Оплата</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setPaymentMethod(m.id)}
              className={`min-h-11 rounded-2xl border p-4 text-left transition-all duration-200 ${
                paymentMethod === m.id
                  ? 'theme-card-accent border-accent/30 bg-accent/[0.06]'
                  : 'theme-card border-border bg-surface/40 hover:border-accent/10'
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <p className="mt-2 text-sm font-semibold text-foreground">{m.name}</p>
              <p className="text-xs text-muted">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Summary + Pay */}
      <div className="theme-card-accent rounded-2xl border border-border bg-surface/50 p-5 backdrop-blur-sm md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Итого</p>
            <div className="flex items-baseline gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${selectedPlan}-${period}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="font-heading text-3xl font-extrabold text-foreground"
                >
                  ₽{finalPrice}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm text-muted">
                за {period} мес ({monthPrice}₽/мес)
              </span>
            </div>
            {period > 1 && basePrice !== monthPrice && (
              <p className="mt-1 text-xs text-muted">
                <span className="line-through">₽{basePrice * period}</span>
                <span className="ml-2 rounded bg-accent/15 px-1.5 py-0.5 text-accent">
                  −{Math.round((1 - monthPrice / basePrice) * 100)}%
                </span>
              </p>
            )}
            {hasReferral && discount > 0 && (
              <p className="mt-1 text-xs text-accent">
                Реферальная скидка: −₽{discount}
              </p>
            )}
          </div>

          <Button
            size="lg"
            className="glow-cyan px-10 text-base font-semibold"
            onPress={handlePurchase}
            isPending={loading}
          >
            Оплатить
          </Button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-danger">{error}</p>
        )}
      </div>
    </div>
  )
}
