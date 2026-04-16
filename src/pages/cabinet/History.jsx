import { useState, useEffect } from 'react'
import { Chip, Spinner } from '@heroui/react'
import { getPaymentHistory } from '../../api/subscriptions'

const METHOD_LABELS = {
  stars: 'Stars',
  crypto: 'Crypto',
  wata: 'Карта',
  trial: 'Триал',
  gift_promo: 'Промокод',
  downgrade: 'Смена тарифа',
}

const STATUS_COLORS = {
  paid: 'success',
  cancelled: 'default',
  expired: 'warning',
  pending: 'primary',
}

export default function History() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPaymentHistory()
      .then(setPayments)
      .catch(err => setError(err.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner size="lg" color="current" className="text-accent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-heading text-2xl font-bold text-foreground">История платежей</h1>

      {error ? (
        <div className="theme-card rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
          <p className="text-sm text-danger">{error}</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="theme-card rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">Платежей пока нет</p>
        </div>
      ) : (
        <div className="space-y-2">
          {payments.map(p => (
            <div key={p.id} className="theme-card rounded-xl border border-border bg-surface px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{p.plan_name}</span>
                    {p.period_months > 0 && (
                      <span className="text-xs text-muted">{p.period_months} мес</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {new Date(p.created_at).toLocaleDateString('ru', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}
                    {METHOD_LABELS[p.payment_method] || p.payment_method}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {parseFloat(p.price_paid) > 0 && (
                    <span className="text-sm font-semibold text-foreground">{p.price_paid} ₽</span>
                  )}
                  <Chip size="sm" color={STATUS_COLORS[p.status] || 'default'}>
                    {p.status === 'paid' ? 'Оплачен' : p.status === 'cancelled' ? 'Отменён' : p.status === 'expired' ? 'Истёк' : p.status}
                  </Chip>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
