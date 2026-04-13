import { motion } from 'motion/react'
import { ArrowDownToSquare } from '@gravity-ui/icons'

const EXPORTS = [
  { type: 'users', title: 'Users', description: 'Export all users as CSV' },
  { type: 'subscriptions', title: 'Subscriptions', description: 'Export subscriptions as CSV' },
  { type: 'payments', title: 'Payments', description: 'Export payments as CSV' },
  { type: 'referrals', title: 'Referrals', description: 'Export referrals as CSV' },
]

function handleExport(type) {
  const token = localStorage.getItem('eifavpn_access')
  window.open(`/api/admin/export/${type}/?token=${token}`, '_blank')
}

export default function Export() {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Export Data</h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {EXPORTS.map((exp, i) => (
          <motion.div
            key={exp.type}
            className="rounded-xl border border-border bg-surface p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{exp.title}</p>
                <p className="mt-1 text-xs text-muted">{exp.description}</p>
                <p className="mt-2 text-[10px] text-muted">Click to download the latest data</p>
              </div>
              <ArrowDownToSquare className="h-5 w-5 shrink-0 text-muted" />
            </div>
            <button
              onClick={() => handleExport(exp.type)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-accent/15 px-4 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/25"
            >
              <ArrowDownToSquare className="h-3.5 w-3.5" />
              Download CSV
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
