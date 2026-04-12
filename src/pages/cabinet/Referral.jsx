import { useState, useEffect } from 'react'
import { Button, Chip, Spinner } from '@heroui/react'
import { Copy } from '@gravity-ui/icons'
import { motion } from 'motion/react'
import { useAuthStore } from '../../stores/authStore'
import { getReferralInfo, getReferralList } from '../../api/referrals'

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="glass-card rounded-xl border border-white/[0.05] bg-surface/30 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted md:text-[11px]">{label}</p>
      <p className={`font-heading mt-1 text-2xl font-bold md:text-xl ${accent ? 'text-accent' : 'text-foreground'}`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-muted md:text-[11px]">{sub}</p>}
    </div>
  )
}

export default function Referral() {
  const { user } = useAuthStore()
  const [info, setInfo] = useState(null)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    Promise.all([
      getReferralInfo().catch(() => null),
      getReferralList().catch(() => []),
    ])
      .then(([infoData, listData]) => {
        setInfo(infoData)
        setList(Array.isArray(listData) ? listData : [])
      })
      .finally(() => setLoading(false))
  }, [])

  const referralCode = info?.code || user?.referral_code || ''
  const referralLink = info?.link || `https://eifavpn.ru/register?ref=${referralCode}`

  function handleCopy() {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-3 px-3 md:space-y-5 md:px-0">
      <h1 className="font-heading text-2xl font-bold text-foreground">Реферальная программа</h1>

      {/* Referral link card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-accent rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/[0.08] to-surface/60 p-5 md:p-6"
      >
        <p className="text-lg font-bold text-foreground">Приглашайте друзей</p>
        <p className="mt-1 text-sm text-muted">
          Делитесь ссылкой и получайте бонусы за каждого приглашённого.
        </p>

        <div className="mt-4">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
            Ваш реферальный код
          </p>
          <div className="inline-block rounded-lg bg-black/20 px-4 py-2">
            <span className="font-mono text-lg font-bold tracking-widest text-accent">
              {referralCode}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
            Реферальная ссылка
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-black/20 px-3 py-2 font-mono text-xs text-accent">
              {referralLink}
            </code>
            <Button
              size="sm"
              variant={copied ? undefined : 'outline'}
              className={copied ? 'bg-accent text-accent-foreground' : ''}
              onPress={handleCopy}
              startContent={<Copy className="h-3.5 w-3.5" />}
            >
              {copied ? 'Скопировано!' : 'Копировать'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <StatCard
          label="Приглашено"
          value={info?.total_referrals ?? 0}
          sub="пользователей"
          accent
        />
        <StatCard
          label="Бонусных дней"
          value={`+${info?.bonus_days_earned ?? 0}`}
          sub="дней к подписке"
          accent
        />
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-2xl border border-white/[0.06] bg-surface/40 p-4 md:p-5"
      >
        <p className="mb-3 text-sm font-semibold text-foreground">Как это работает?</p>
        <div className="space-y-3">
          {[
            {
              step: '1',
              title: 'Поделитесь ссылкой',
              desc: 'Отправьте реферальную ссылку другу. Он может использовать её при регистрации.',
            },
            {
              step: '2',
              title: 'Друг получает скидку',
              desc: 'Приглашённый пользователь получает скидку 10% на первую покупку подписки.',
            },
            {
              step: '3',
              title: 'Вы получаете бонус',
              desc: 'Когда друг оплачивает подписку, вам начисляется +7 дней к текущей подписке.',
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="mt-0.5 text-[13px] text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Referred users list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl border border-white/[0.06] bg-surface/40 p-4 md:p-5"
      >
        <p className="mb-3 text-sm font-semibold text-foreground">Приглашённые пользователи</p>

        {list.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted">
            Пока никто не зарегистрировался по вашей ссылке
          </p>
        ) : (
          <div className="space-y-2">
            {list.map((ref, i) => (
              <div
                key={i}
                className="glass-card flex min-h-11 items-center justify-between rounded-xl border border-white/[0.04] bg-black/10 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{ref.email}</p>
                  <p className="text-[11px] text-muted">{ref.date}</p>
                </div>
                <Chip
                  size="sm"
                  className={
                    ref.subscribed
                      ? 'bg-accent/15 text-[10px] font-semibold text-accent'
                      : 'bg-default text-[10px] text-muted'
                  }
                >
                  {ref.subscribed ? 'Подписан' : 'Без подписки'}
                </Chip>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
