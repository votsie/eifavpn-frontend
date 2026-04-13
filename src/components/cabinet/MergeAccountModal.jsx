import { Button } from '@heroui/react'
import { motion, AnimatePresence } from 'motion/react'
import { createPortal } from 'react-dom'

const PLAN_LABELS = { standard: 'Standard', pro: 'Pro', max: 'Max' }

export default function MergeAccountModal({ isOpen, onClose, preview, provider, onConfirm, loading, error }) {
  if (!isOpen || !preview) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-[420px] rounded-2xl border border-border bg-surface/95 p-5 shadow-2xl backdrop-blur-2xl"
        >
          <h3 className="text-lg font-bold text-foreground">Объединение аккаунтов</h3>
          <p className="mt-2 text-sm text-muted">
            Этот {provider === 'telegram' ? 'Telegram' : 'Google'} привязан к аккаунту{' '}
            <span className="font-medium text-foreground">{preview.secondary_email_masked}</span>.
            Хотите объединить аккаунты?
          </p>

          <div className="mt-4 space-y-2">
            {/* Subscription info */}
            {preview.result_plan && (
              <div className="rounded-xl border border-accent/20 bg-accent/[0.06] px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Итоговая подписка</p>
                <p className="mt-1 text-sm font-bold text-accent">
                  {PLAN_LABELS[preview.result_plan] || preview.result_plan} — {preview.result_days_left} дн.
                </p>
              </div>
            )}

            {/* Referrals */}
            {preview.referrals_moved > 0 && (
              <div className="rounded-xl border border-border theme-subtle-bg px-4 py-3">
                <p className="text-xs text-muted">
                  Реферальные бонусы: +{preview.referral_bonus_combined} дней,{' '}
                  {preview.referrals_moved} реферал(ов) перенесены
                </p>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-danger/80">
            Это действие необратимо. Второй аккаунт будет удалён.
          </p>

          {error && <p className="mt-2 text-sm text-danger">{error}</p>}

          <div className="mt-4 flex gap-2">
            <Button
              className="glow-cyan flex-1 font-semibold"
              onPress={onConfirm}
              isPending={loading}
            >
              Объединить
            </Button>
            <Button variant="outline" className="flex-1" onPress={onClose} isDisabled={loading}>
              Отмена
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
