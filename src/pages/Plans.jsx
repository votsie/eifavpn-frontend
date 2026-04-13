import { useState } from 'react'
import { Button, Chip } from '@heroui/react'
import { CircleCheck, CircleXmark } from '@gravity-ui/icons'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'

const periods = [
  { id: 1, label: '1 мес' },
  { id: 3, label: '3 мес' },
  { id: 6, label: '6 мес', badge: '-20%' },
  { id: 12, label: '12 мес', badge: '-35%' },
]

const pricing = {
  standard: { 1: 69, 3: 59, 6: 55, 12: 45 },
  pro: { 1: 99, 3: 89, 6: 79, 12: 65 },
  max: { 1: 149, 3: 129, 6: 119, 12: 99 },
}

const plans = [
  {
    id: 'standard',
    name: 'Standard',
    desc: 'Базовая защита',
    features: [
      { text: '7 серверов', ok: true },
      { text: 'До 3 устройств', ok: true },
      { text: '1 ТБ трафика/мес', ok: true },
      { text: 'AES-256', ok: true },
      { text: 'Блокировщик рекламы', ok: false },
      { text: 'Торренты (P2P)', ok: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'Для ежедневного использования',
    badge: 'Популярный',
    popular: true,
    features: [
      { text: '10 серверов', ok: true },
      { text: 'До 4 устройств', ok: true },
      { text: 'AES-256', ok: true },
      { text: 'Блокировщик рекламы', ok: true },
      { text: 'Торренты (P2P)', ok: false },
    ],
  },
  {
    id: 'max',
    name: 'Max',
    desc: 'Максимальная свобода',
    features: [
      { text: '14 серверов', ok: true },
      { text: 'До 6 устройств', ok: true },
      { text: 'AES-256', ok: true },
      { text: 'Блокировщик рекламы', ok: true },
      { text: 'Торренты (P2P)', ok: true },
    ],
  },
]

export default function Plans() {
  const [period, setPeriod] = useState(1)
  const navigate = useNavigate()

  return (
    <section id="plans" className="scroll-mt-20 relative z-10 px-5 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-accent/15 bg-accent/8 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
            Тарифы
          </span>
          <h2 className="font-heading mt-4 text-2xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-[42px]">
            Простые и честные цены
          </h2>
          <p className="mt-3 text-sm text-muted md:text-base">
            Чем дольше период — тем выгоднее. Отмена в любой момент.
          </p>
        </motion.div>

        {/* Period selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 flex justify-center"
        >
          <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface p-1">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`relative rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                  period === p.id
                    ? 'bg-accent text-accent-foreground glow-cyan'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {p.label}
                {p.badge && period !== p.id && (
                  <span className="absolute -top-2 -right-1 rounded bg-accent/20 px-1 py-0.5 text-[9px] font-bold text-accent">
                    {p.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid items-start gap-4 md:grid-cols-3 md:gap-5">
          {plans.map((plan, i) => {
            const price = pricing[plan.id][period]
            const base = pricing[plan.id][1]
            const total = price * period
            const saved = base * period - total
            const pct = period === 1 ? 0 : Math.round((1 - price / base) * 100)

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={plan.popular ? 'md:-mt-3' : ''}
              >
                <div className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 md:p-7 ${
                  plan.popular
                    ? 'border-accent bg-surface'
                    : 'border-border bg-surface hover:border-accent/10'
                }`}>

                  {/* Name */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-lg font-bold text-foreground">{plan.name}</h3>
                      {plan.badge && (
                        <Chip size="sm" className="bg-accent/12 text-[10px] font-bold text-accent">{plan.badge}</Chip>
                      )}
                    </div>
                    <p className="mt-0.5 text-[13px] text-muted">{plan.desc}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1.5">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${plan.id}-${period}`}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="font-heading text-3xl font-extrabold text-foreground"
                        >
                          ₽{price}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-[13px] text-muted">/мес</span>
                    </div>

                    {period > 1 && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="text-[12px] text-muted line-through">₽{base}/мес</span>
                        <span className="rounded bg-accent/12 px-1.5 py-0.5 text-[10px] font-bold text-accent">−{pct}%</span>
                      </div>
                    )}
                    {period > 1 && (
                      <p className="mt-1 text-[11px] text-muted">
                        Итого ₽{total}{saved > 0 && <span className="text-accent"> (−₽{saved})</span>}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="mb-6 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-center gap-2 text-[13px]">
                        {f.ok ? (
                          <CircleCheck className={`h-3.5 w-3.5 shrink-0 ${plan.popular ? 'text-accent' : 'text-accent/60'}`} />
                        ) : (
                          <CircleXmark className="h-3.5 w-3.5 shrink-0 text-muted/30" />
                        )}
                        <span className={f.ok ? 'text-foreground/80' : 'text-muted/40 line-through'}>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    fullWidth
                    size="lg"
                    variant={plan.popular ? undefined : 'outline'}
                    className="text-[14px] font-semibold"
                    onPress={() => navigate(`/register?plan=${plan.id}`)}
                  >
                    {plan.popular ? 'Подключить Pro' : `Выбрать ${plan.name}`}
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center text-[12px] text-muted"
        >
          7 дней бесплатного пробного периода. Возврат средств в течение 30 дней.
        </motion.p>
      </div>
    </section>
  )
}
