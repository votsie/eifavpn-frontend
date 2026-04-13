import { useState } from 'react'
import { motion } from 'motion/react'

const PLANS = {
  Standard: { '1': 69, '3': 59, '6': 55, '12': 45 },
  Pro: { '1': 99, '3': 89, '6': 79, '12': 65 },
  Max: { '1': 149, '3': 129, '6': 119, '12': 99 },
}

const PERIODS = ['1', '3', '6', '12']

export default function Pricing() {
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(
      Object.entries(PLANS).map(([plan, periods]) => [
        plan,
        { ...periods },
      ])
    )
  )

  function handleChange(plan, period, value) {
    setPrices((prev) => ({
      ...prev,
      [plan]: { ...prev[plan], [period]: value },
    }))
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Цены</h1>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-400">
        Редактирование цен пока недоступно — требуется серверный endpoint
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="pb-3 pr-4 font-medium">План</th>
                {PERIODS.map((p) => (
                  <th key={p} className="pb-3 px-2 font-medium text-center">
                    {p} мес
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(prices).map(([plan, periods], ri) => (
                <motion.tr
                  key={plan}
                  className="border-b border-border/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: ri * 0.05 }}
                >
                  <td className="py-3 pr-4 font-heading font-bold text-foreground">{plan}</td>
                  {PERIODS.map((p) => (
                    <td key={p} className="py-3 px-2">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={periods[p]}
                          onChange={(e) => handleChange(plan, p, Number(e.target.value))}
                          className="w-16 rounded-lg border border-border bg-surface px-2 py-1.5 text-center text-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent/50"
                          disabled
                        />
                        <span className="text-xs text-muted">₽</span>
                      </div>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            disabled
            className="rounded-lg bg-accent/15 px-6 py-2 text-sm font-semibold text-accent opacity-50 cursor-not-allowed"
          >
            Сохранить
          </button>
        </div>
      </div>
    </motion.div>
  )
}
