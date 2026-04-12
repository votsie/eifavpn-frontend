import { Chip } from '@heroui/react'

const STATUS_MAP = {
  ACTIVE: { label: 'Активна', className: 'bg-accent/15 text-accent' },
  EXPIRED: { label: 'Истекла', className: 'bg-danger/15 text-danger' },
  LIMITED: { label: 'Лимит', className: 'bg-warning/15 text-warning' },
  DISABLED: { label: 'Отключена', className: 'bg-default text-muted' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || STATUS_MAP.DISABLED

  return (
    <Chip size="sm" className={`text-xs font-semibold ${config.className}`}>
      {config.label}
    </Chip>
  )
}
