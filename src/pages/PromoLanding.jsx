import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button, Spinner } from '@heroui/react'
import { motion } from 'motion/react'
import { getPromoInfo } from '../api/subscriptions'
import Background from '../components/Background'

const TYPE_LABELS = {
  percent: (v) => `Скидка ${v}%`,
  days: (v) => `+${v} бонусных дней`,
  gift: (v) => `${v} дней бесплатно`,
}

export default function PromoLanding() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [promo, setPromo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    if (!code) { setInvalid(true); setLoading(false); return }
    getPromoInfo(code)
      .then(data => {
        if (data?.valid) {
          setPromo(data)
          localStorage.setItem('eifavpn_promo', data.code)
        } else {
          setInvalid(true)
        }
      })
      .catch(() => setInvalid(true))
      .finally(() => setLoading(false))
  }, [code])

  function handleAction() {
    localStorage.setItem('eifavpn_promo', promo.code)
    navigate(`/cabinet/purchase?promo=${promo.code}`)
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <Background />
        <Spinner size="lg" color="current" className="text-accent" />
      </div>
    )
  }

  if (invalid) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <Background />
        <div className="relative z-10 text-center">
          <img src="/logo.png" alt="EIFAVPN" className="mx-auto h-16 w-16 object-contain" />
          <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Промокод недействителен</h1>
          <p className="mt-2 text-sm text-muted">Возможно, срок действия истёк или код введён неверно.</p>
          <Link to="/" className="mt-6 inline-block text-sm font-medium text-accent hover:text-accent/80">
            На главную
          </Link>
        </div>
      </div>
    )
  }

  const typeLabel = TYPE_LABELS[promo.promo_type]?.(promo.value) || 'Специальное предложение'

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <Background />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-3xl border border-accent/20 bg-surface/80 p-8 text-center backdrop-blur-xl">
          <img src="/logo.png" alt="EIFAVPN" className="mx-auto h-16 w-16 object-contain" />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="mt-5 font-heading text-3xl font-extrabold text-foreground">
              {typeLabel}
            </h1>

            <div className="mx-auto mt-4 inline-block rounded-xl bg-accent/10 px-6 py-3">
              <span className="font-mono text-2xl font-bold tracking-widest text-accent">
                {promo.code}
              </span>
            </div>

            {promo.description && (
              <p className="mt-4 text-sm text-muted">{promo.description}</p>
            )}

            <p className="mt-3 text-sm text-muted">
              {promo.promo_type === 'percent' && 'Скидка применится автоматически при покупке любого тарифа.'}
              {promo.promo_type === 'days' && 'Бонусные дни будут добавлены после оплаты подписки.'}
              {promo.promo_type === 'gift' && 'Активируйте подарок без покупки — получите бесплатные дни VPN.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-3"
          >
            <Button
              fullWidth size="lg"
              className="glow-cyan h-12 text-base font-semibold"
              onPress={handleAction}
            >
              {promo.promo_type === 'gift' ? 'Активировать подарок' : 'Выбрать тариф со скидкой'}
            </Button>

            <p className="text-xs text-muted">
              Нет аккаунта?{' '}
              <Link to={`/register?promo=${promo.code}`} className="font-medium text-accent">
                Зарегистрироваться
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '🔐', label: 'VLESS + Reality' },
            { icon: '🌍', label: 'До 14 серверов' },
            { icon: '⚡', label: 'До 300 Мбит/с' },
          ].map(f => (
            <div key={f.label} className="rounded-xl border border-border bg-surface/50 p-3">
              <span className="text-xl">{f.icon}</span>
              <p className="mt-1 text-[11px] font-medium text-muted">{f.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
