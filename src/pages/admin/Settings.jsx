import { motion } from 'motion/react'

export default function Settings() {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Настройки</h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {/* Plans & Pricing */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-foreground">Планы и цены</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Standard</span>
              <span className="font-medium text-foreground">69 &#8381;/мес</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Pro</span>
              <span className="font-medium text-foreground">99 &#8381;/мес</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Max</span>
              <span className="font-medium text-foreground">149 &#8381;/мес</span>
            </div>
          </div>
        </div>

        {/* Referral Program */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-foreground">Реферальная программа</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Скидка</span>
              <span className="font-medium text-foreground">10%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Бонусные дни</span>
              <span className="font-medium text-foreground">7 дней</span>
            </div>
          </div>
        </div>

        {/* Trial Settings */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-foreground">Настройки триала</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Длительность</span>
              <span className="font-medium text-foreground">3 дня</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">План</span>
              <span className="font-medium text-foreground">MAX (free)</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
