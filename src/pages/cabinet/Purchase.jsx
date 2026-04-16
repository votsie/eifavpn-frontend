import { useState, useEffect, useCallback, useRef } from 'react'
import { Button, Spinner } from '@heroui/react'
import { CircleCheck, CircleXmark } from '@gravity-ui/icons'
import { motion, AnimatePresence } from 'motion/react'
import { useSearchParams } from 'react-router-dom'
import { getPlans, purchase, activateGift, getMySubscription, getExchangeRates, getUpgradePreview, purchaseUpgrade } from '../../api/subscriptions'
import { useAuthStore } from '../../stores/authStore'
import PromoInput from '../../components/PromoInput'
import { openPaymentUrl } from '../../utils/openPayment'

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
  { key: 'unlimited_traffic', format: (v) => v ? 'Безлимит' : '1 ТБ/мес' },
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
  const [promoData, setPromoData] = useState(null)
  const [giftLoading, setGiftLoading] = useState(false)
  const [awaitingPayment, setAwaitingPayment] = useState(false)
  const [cryptoAsset, setCryptoAsset] = useState('USDT')
  const [rates, setRates] = useState(null)
  const [activeSub, setActiveSub] = useState(null)
  const [upgradePreview, setUpgradePreview] = useState(null)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const pollingRef = useRef(null)
  const pollingTimeoutRef = useRef(null)
  const { user } = useAuthStore()
  const [searchParams] = useSearchParams()

  // Resolve initial promo code from URL > localStorage > user.pending
  const initialPromo = searchParams.get('promo')
    || localStorage.getItem('eifavpn_promo')
    || user?.pending_promo_code
    || ''

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch((err) => setPlansError(err.message || 'Ошибка загрузки тарифов'))
      .finally(() => setPlansLoading(false))
    getExchangeRates().then(setRates).catch(() => {})
    getMySubscription().then(data => {
      if (data?.subscription?.status === 'paid') setActiveSub(data.subscription)
    }).catch(() => {})
  }, [])

  const currentPlan = plans.find((p) => p.id === selectedPlan)
  const basePrice = currentPlan?.pricing?.[1] || 0
  const monthPrice = currentPlan?.pricing?.[period] || 0
  const totalPrice = monthPrice * period
  const hasReferral = !!user?.referred_by
  const referralDiscount = hasReferral ? Math.round(totalPrice * 0.1) : 0
  const afterReferral = totalPrice - referralDiscount

  // Promo discount
  const promoDiscount = promoData?.promo_type === 'percent'
    ? Math.round(afterReferral * promoData.value / 100) : 0
  const bonusDays = promoData?.promo_type === 'days' ? promoData.value : 0
  const isGift = promoData?.promo_type === 'gift'
  const finalPrice = Math.max(afterReferral - promoDiscount, 1)

  // Crypto price calculation (3% markup built into backend rates)
  const isCrypto = paymentMethod === 'crypto'
  const isStars = paymentMethod === 'stars'
  const cryptoRate = rates?.rates?.[cryptoAsset] || 0
  const cryptoAmount = cryptoRate > 0 ? ((finalPrice * 1.03) / cryptoRate).toFixed(cryptoAsset === 'BTC' ? 6 : 2) : '...'

  // Stars calculation: 50 stars = 0.75$ × USDT_RUB + 15% markup, ceil
  const starPriceRub = rates?.star_price_rub || 1.13
  const starsAmount = starPriceRub > 0 ? Math.ceil((finalPrice / starPriceRub) * 1.15) : '...'

  // Fetch upgrade preview when user has active sub and changes plan/period
  useEffect(() => {
    if (!activeSub) { setUpgradePreview(null); return }
    if (selectedPlan === activeSub.plan && period === activeSub.period_months) {
      setUpgradePreview(null); return
    }
    setUpgradeLoading(true)
    getUpgradePreview({ plan: selectedPlan, period })
      .then(setUpgradePreview)
      .catch(() => setUpgradePreview(null))
      .finally(() => setUpgradeLoading(false))
  }, [activeSub, selectedPlan, period])

  async function handleUpgrade() {
    if (!upgradePreview) return
    setLoading(true)
    setError(null)

    if (upgradePreview.charge_amount > 0) {
      // Paid upgrade — open payment
      const isMiniApp = !!window.Telegram?.WebApp?.initData
      const payWindow = isMiniApp ? null : window.open('about:blank', '_blank')
      try {
        const result = await purchaseUpgrade({
          plan: selectedPlan,
          period,
          payment_method: paymentMethod,
          crypto_asset: isCrypto ? cryptoAsset : undefined,
        })
        if (result.payment_url) {
          if (isMiniApp) window.Telegram.WebApp.openLink(result.payment_url)
          else if (payWindow) payWindow.location.href = result.payment_url
          else window.location.href = result.payment_url
          startPaymentPolling()
        } else { if (payWindow) payWindow.close() }
      } catch (err) {
        if (payWindow) payWindow.close()
        setError(err.message || 'Ошибка при смене тарифа')
      } finally { setLoading(false) }
    } else {
      // Free downgrade
      try {
        await purchaseUpgrade({
          plan: selectedPlan,
          period,
          payment_method: 'downgrade',
        })
        window.location.href = '/cabinet/overview'
      } catch (err) {
        setError(err.message || 'Ошибка при смене тарифа')
      } finally { setLoading(false) }
    }
  }

  const handlePromoApplied = useCallback((data) => {
    setPromoData(data)
  }, [])

  // Cleanup polling + timeout on unmount
  useEffect(() => () => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current)
  }, [])

  function startPaymentPolling() {
    setAwaitingPayment(true)
    if (pollingRef.current) clearInterval(pollingRef.current)
    pollingRef.current = setInterval(async () => {
      try {
        const data = await getMySubscription()
        if (data?.subscription?.status === 'paid') {
          clearInterval(pollingRef.current)
          pollingRef.current = null
          setAwaitingPayment(false)
          window.location.href = '/cabinet/overview'
        }
      } catch { /* ignore */ }
    }, 3000)
    // Stop polling after 5 minutes
    pollingTimeoutRef.current = setTimeout(() => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
        setAwaitingPayment(false)
      }
    }, 300000)
  }

  async function handlePurchase() {
    setLoading(true)
    setError(null)

    // Open blank window BEFORE await — browsers block popups after async calls
    const isMiniApp = !!window.Telegram?.WebApp?.initData
    const payWindow = isMiniApp ? null : window.open('about:blank', '_blank')

    try {
      const result = await purchase({
        plan: selectedPlan,
        period,
        payment_method: paymentMethod,
        promo_code: promoData?.code || '',
        crypto_asset: isCrypto ? cryptoAsset : undefined,
      })
      if (result.payment_url) {
        localStorage.removeItem('eifavpn_promo')
        if (isMiniApp) {
          window.Telegram.WebApp.openLink(result.payment_url)
        } else if (payWindow) {
          payWindow.location.href = result.payment_url
        } else {
          // Fallback if popup was blocked anyway
          window.location.href = result.payment_url
        }
        startPaymentPolling()
      } else {
        if (payWindow) payWindow.close()
      }
    } catch (err) {
      if (payWindow) payWindow.close()
      setError(err.message || 'Ошибка при создании платежа')
    } finally {
      setLoading(false)
    }
  }

  async function handleActivateGift() {
    if (!promoData?.code) return
    setGiftLoading(true)
    setError(null)
    try {
      const result = await activateGift(promoData.code)
      if (result.success) {
        localStorage.removeItem('eifavpn_promo')
        setPromoData(null)
        setError(null)
        window.location.href = '/cabinet/overview'
      }
    } catch (err) {
      setError(err.message || 'Ошибка активации подарочных дней')
    } finally {
      setGiftLoading(false)
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

      {/* Period + Payment */}
      <div className="flex flex-col gap-4">
        {/* Period */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Период</p>
          <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                aria-pressed={period === p.id}
                className={`relative flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
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
          <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                aria-pressed={paymentMethod === m.id}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
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

      {/* Promo code */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Промокод</p>
        <PromoInput
          plan={selectedPlan}
          period={period}
          onPromoApplied={handlePromoApplied}
          initialCode={initialPromo}
        />
      </div>

      {/* Gift promo activation */}
      {isGift && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <p className="text-sm font-semibold text-foreground">
            Подарочный промокод: +{promoData.value} дней бесплатно
          </p>
          <p className="mt-1 text-xs text-muted">{promoData.description || 'Активируйте без покупки'}</p>
          <Button
            size="sm"
            className="mt-3 bg-green-600 text-white font-semibold"
            onPress={handleActivateGift}
            isPending={giftLoading}
          >
            Активировать {promoData.value} дней
          </Button>
        </div>
      )}

      {/* EIFASTORE promo — only when Telegram Stars selected */}
      {paymentMethod === 'stars' && (
        <a
          href="https://t.me/EIFASTORE_BOT"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/[0.04] p-3 transition-colors hover:bg-accent/[0.08]"
        >
          <img src="/eifastore-logo.png" alt="EIFASTORE" className="h-9 w-9 rounded-lg object-contain" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Купить Telegram Stars</p>
            <p className="text-xs text-muted">Выгодный курс в EIFASTORE</p>
          </div>
          <span className="shrink-0 rounded-md bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Открыть</span>
        </a>
      )}

      {/* Crypto asset selector — only when crypto selected */}
      {isCrypto && (
        <div className="rounded-xl border border-accent/20 bg-accent/[0.04] p-3 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Криптовалюта</p>
          <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
            {['USDT', 'TON'].map((asset) => (
              <button
                key={asset}
                onClick={() => setCryptoAsset(asset)}
                aria-pressed={cryptoAsset === asset}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  cryptoAsset === asset
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {asset}
              </button>
            ))}
          </div>
          {cryptoRate > 0 && (
            <p className="text-[11px] text-muted">
              Курс: 1 {cryptoAsset} = {cryptoRate.toFixed(2)}₽ (+ 3% комиссия)
            </p>
          )}
        </div>
      )}

      {/* Upgrade banner — shown when user has active subscription and selects different plan */}
      {activeSub && upgradePreview && (
        <div className="rounded-xl border border-accent/30 bg-accent/[0.04] p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">
            {upgradePreview.is_upgrade ? '⬆ Повышение тарифа' : '⬇ Понижение тарифа'}
          </p>
          <p className="text-xs text-muted">
            Текущий тариф: <span className="text-foreground font-medium">{activeSub.plan_name || activeSub.plan}</span>
            {' · '}Осталось {upgradePreview.remaining_days} дн.
          </p>
          {upgradePreview.is_upgrade ? (
            <>
              <p className="text-xs text-muted">
                Зачёт остатка: <span className="text-accent">{upgradePreview.current_credit}₽</span>
                {' · '}Новый тариф: {upgradePreview.new_total}₽
                {' · '}К оплате: <span className="font-bold text-foreground">{upgradePreview.charge_amount}₽</span>
              </p>
              <Button
                size="sm"
                className="glow-cyan font-semibold"
                onPress={handleUpgrade}
                isPending={loading}
              >
                Перейти на {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} — {upgradePreview.charge_amount}₽
              </Button>
            </>
          ) : (
            <>
              <p className="text-xs text-muted">
                Кредит: +{upgradePreview.credit_days} бонусных дней
              </p>
              <Button
                size="sm"
                variant="outline"
                onPress={handleUpgrade}
                isPending={loading}
              >
                Перейти на {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
              </Button>
            </>
          )}
        </div>
      )}

      {/* Current plan indicator */}
      {activeSub && !upgradePreview && !upgradeLoading && (
        <div className="rounded-xl border border-border bg-surface/50 p-3 text-center">
          <p className="text-xs text-muted">Вы уже на тарифе <span className="font-medium text-foreground">{activeSub.plan_name || activeSub.plan}</span></p>
        </div>
      )}

      {/* Summary — show when no active sub OR no upgrade available */}
      {!isGift && !(activeSub && upgradePreview) && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
          <div>
            <div className="flex items-baseline gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${selectedPlan}-${period}-${promoData?.code || ''}-${cryptoAsset}-${paymentMethod}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="font-heading text-2xl font-extrabold text-foreground"
                >
                  {isCrypto ? `${cryptoAmount} ${cryptoAsset}`
                    : isStars ? `${starsAmount} ⭐`
                    : `${finalPrice}₽`}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm text-muted">
                {isCrypto
                  ? `≈ ${finalPrice}₽ за ${period > 1 ? `${period} мес` : '1 мес'}`
                  : isStars
                  ? `≈ ${finalPrice}₽ за ${period > 1 ? `${period} мес` : '1 мес'}`
                  : period > 1 ? `за ${period} мес (${monthPrice}₽/мес)` : 'за 1 мес'
                }
              </span>
            </div>
            {period > 1 && basePrice !== monthPrice && (
              <p className="mt-0.5 text-xs text-muted">
                <span className="line-through">{basePrice * period}₽</span>
                <span className="ml-1.5 text-accent font-medium">-{Math.round((1 - monthPrice / basePrice) * 100)}%</span>
              </p>
            )}
            {hasReferral && referralDiscount > 0 && (
              <p className="mt-0.5 text-xs text-accent">Реферальная скидка: -{referralDiscount}₽</p>
            )}
            {promoDiscount > 0 && (
              <p className="mt-0.5 text-xs text-green-500">Промокод {promoData.code}: -{promoDiscount}₽</p>
            )}
            {bonusDays > 0 && (
              <p className="mt-0.5 text-xs text-green-500">Промокод {promoData.code}: +{bonusDays} дней</p>
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
      )}

      {/* Awaiting payment banner */}
      {awaitingPayment && (
        <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/[0.04] p-4 animate-pulse">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Ожидание оплаты...</p>
            <p className="text-xs text-muted">Завершите оплату в открывшемся окне. Страница обновится автоматически.</p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}
