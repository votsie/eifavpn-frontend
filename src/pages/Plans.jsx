import { useState } from 'react'
import { Button, Chip } from '@heroui/react'
import { CircleCheck, CircleXmark } from '@gravity-ui/icons'
import { motion, AnimatePresence } from 'motion/react'

/* ── Pricing data ─────────────────────────────────── */

const periods = [
  { id: 1,  label: '1 мес',   discount: 0,    badge: null },
  { id: 3,  label: '3 мес',   discount: 0,    badge: null },
  { id: 6,  label: '6 мес',   discount: 0,    badge: '-20%' },
  { id: 12, label: '12 мес',  discount: 0,    badge: '-35%' },
]

// Per-month prices after discount, rounded to nice numbers
const pricing = {
  standard: { 1: 69,  3: 59,  6: 55,  12: 45 },
  pro:      { 1: 99,  3: 89,  6: 79,  12: 65 },
  max:      { 1: 149, 3: 129, 6: 119, 12: 99 },
}

const plans = [
  {
    id: 'standard',
    name: 'Standard',
    desc: 'Базовая защита для повседневного использования',
    features: [
      { text: '7 серверов', included: true },
      { text: 'До 3 устройств', included: true },
      { text: 'Шифрование AES-256', included: true },
      { text: 'Блокировщик рекламы', included: false },
      { text: 'Торренты (P2P)', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'Расширенная защита с блокировкой рекламы',
    badge: 'Популярный',
    popular: true,
    features: [
      { text: '10 серверов', included: true },
      { text: 'До 4 устройств', included: true },
      { text: 'Шифрование AES-256', included: true },
      { text: 'Блокировщик рекламы', included: true },
      { text: 'Торренты (P2P)', included: false },
    ],
  },
  {
    id: 'max',
    name: 'Max',
    desc: 'Максимальная свобода без ограничений',
    features: [
      { text: '14 серверов', included: true },
      { text: 'До 6 устройств', included: true },
      { text: 'Шифрование AES-256', included: true },
      { text: 'Блокировщик рекламы', included: true },
      { text: 'Торренты (P2P)', included: true },
    ],
  },
]

/* ── Component ────────────────────────────────────── */

export default function Plans({ selectedPlan, onSelect }) {
  const [period, setPeriod] = useState(1)

  const basePrice = (planId) => pricing[planId][1]
  const currentPrice = (planId) => pricing[planId][period]
  const totalPrice = (planId) => currentPrice(planId) * period
  const savedTotal = (planId) => basePrice(planId) * period - totalPrice(planId)
  const discountPct = (planId) =>
    period === 1 ? 0 : Math.round((1 - currentPrice(planId) / basePrice(planId)) * 100)

  return (
    <section id="plans" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            Тарифы
          </span>
          <h2 className="font-heading mt-4 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Простые и честные цены
          </h2>
          <p className="mt-4 text-lg text-muted">
            Чем дольше период — тем выгоднее. Отмена в любой момент.
          </p>
        </motion.div>

        {/* Period selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 flex justify-center"
        >
          <div className="inline-flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-surface/60 p-1.5 backdrop-blur-md">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`relative rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  period === p.id
                    ? 'bg-accent text-accent-foreground shadow-[0_0_20px_oklch(0.80_0.155_180/20%)]'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {p.label}
                {p.badge && period !== p.id && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                    {p.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plan cards */}
        <div className="grid items-start gap-6 md:grid-cols-3">
          {plans.map((plan, i) => {
            const price = currentPrice(plan.id)
            const base = basePrice(plan.id)
            const saved = savedTotal(plan.id)
            const pct = discountPct(plan.id)

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={plan.popular ? 'md:-mt-4' : ''}
              >
                <div
                  className={`relative flex flex-col overflow-hidden rounded-3xl border p-7 backdrop-blur-md transition-all duration-300 ${
                    plan.popular
                      ? 'border-accent/25 bg-gradient-to-b from-accent/[0.08] to-surface/70 shadow-[0_0_40px_oklch(0.80_0.155_180/15%)]'
                      : 'border-white/[0.06] bg-surface/60 hover:border-white/[0.1]'
                  }`}
                >
                  {/* Glow for popular */}
                  {plan.popular && (
                    <div
                      className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, oklch(0.80 0.155 180 / 12%) 0%, transparent 70%)',
                      }}
                    />
                  )}

                  {/* Plan header */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                      {plan.badge && (
                        <Chip size="sm" className="bg-accent/15 text-xs font-semibold text-accent">
                          {plan.badge}
                        </Chip>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted">{plan.desc}</p>
                  </div>

                  {/* Price block */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${plan.id}-${period}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.25 }}
                          className="font-heading text-4xl font-extrabold text-foreground"
                        >
                          ₽{price}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-sm text-muted">/мес</span>
                    </div>

                    {/* Original price & savings */}
                    {period > 1 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 flex flex-wrap items-center gap-2"
                      >
                        <span className="text-sm text-muted line-through">
                          ₽{base}/мес
                        </span>
                        <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                          −{pct}%
                        </span>
                      </motion.div>
                    )}

                    {/* Total for period */}
                    {period > 1 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mt-2 text-xs text-muted"
                      >
                        Итого за {period} мес: <span className="font-semibold text-foreground">₽{totalPrice(plan.id)}</span>
                        {saved > 0 && (
                          <span className="ml-1 text-accent">
                            (экономия ₽{saved})
                          </span>
                        )}
                      </motion.p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat.text} className="flex items-center gap-2.5 text-sm">
                        {feat.included ? (
                          <CircleCheck className={`h-4 w-4 flex-shrink-0 ${
                            plan.popular ? 'text-accent' : 'text-accent/70'
                          }`} />
                        ) : (
                          <CircleXmark className="h-4 w-4 flex-shrink-0 text-muted/40" />
                        )}
                        <span className={feat.included ? 'text-foreground/85' : 'text-muted/50 line-through'}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    fullWidth
                    size="lg"
                    variant={plan.popular ? undefined : 'outline'}
                    className={`font-semibold ${
                      plan.popular ? 'shadow-[0_0_20px_oklch(0.80_0.155_180/20%)]' : ''
                    }`}
                    onPress={() => onSelect(plan.id)}
                  >
                    {plan.popular ? 'Подключить Pro' : `Выбрать ${plan.name}`}
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Guarantee note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center text-sm text-muted/70"
        >
          7 дней бесплатного пробного периода на всех тарифах.
          Возврат средств в течение 30 дней.
        </motion.p>
      </div>
    </section>
  )
}
