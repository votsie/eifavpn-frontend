import { useState, useEffect, useCallback } from 'react'
import { Button, Input, Spinner, Chip } from '@heroui/react'
import { getTickets, getTicketStats, getTicket, updateTicket, replyToTicket } from '../../api/admin'

const STATUS_MAP = {
  open: { label: 'Открыт', color: 'warning' },
  in_progress: { label: 'В работе', color: 'primary' },
  waiting: { label: 'Ожидание', color: 'default' },
  resolved: { label: 'Решён', color: 'success' },
  closed: { label: 'Закрыт', color: 'default' },
}

const PRIORITY_MAP = {
  low: { label: 'Низкий', color: 'default' },
  normal: { label: 'Обычный', color: 'primary' },
  high: { label: 'Высокий', color: 'warning' },
  urgent: { label: 'Срочный', color: 'danger' },
}

const CATEGORY_MAP = {
  connection: 'Подключение',
  payment: 'Оплата',
  account: 'Аккаунт',
  speed: 'Скорость',
  feature: 'Предложение',
  other: 'Другое',
}

export default function Support() {
  const [stats, setStats] = useState(null)
  const [tickets, setTickets] = useState([])
  const [meta, setMeta] = useState({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: '', search: '' })
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketDetail, setTicketDetail] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)

  const loadTickets = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter.status) params.status = filter.status
      if (filter.search) params.search = filter.search
      const data = await getTickets(params)
      setTickets(data.results || [])
      setMeta(data)
    } catch { /* */ }
    setLoading(false)
  }, [filter])

  useEffect(() => { loadTickets() }, [loadTickets])
  useEffect(() => { getTicketStats().then(setStats).catch(() => {}) }, [])

  async function openTicket(id) {
    setSelectedTicket(id)
    try {
      const data = await getTicket(id)
      setTicketDetail(data)
    } catch { /* */ }
  }

  async function handleReply() {
    if (!replyText.trim() || !selectedTicket) return
    setReplying(true)
    try {
      await replyToTicket(selectedTicket, { text: replyText })
      setReplyText('')
      const data = await getTicket(selectedTicket)
      setTicketDetail(data)
      loadTickets()
    } catch { /* */ }
    setReplying(false)
  }

  async function handleStatusChange(status) {
    if (!selectedTicket) return
    await updateTicket(selectedTicket, { status })
    const data = await getTicket(selectedTicket)
    setTicketDetail(data)
    loadTickets()
  }

  async function handleAssignMe() {
    if (!selectedTicket) return
    await updateTicket(selectedTicket, { assigned_to_id: 'me' })
    const data = await getTicket(selectedTicket)
    setTicketDetail(data)
    loadTickets()
  }

  // Detail view
  if (ticketDetail) {
    const t = ticketDetail
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <button onClick={() => { setTicketDetail(null); setSelectedTicket(null) }}
          className="text-sm text-muted hover:text-foreground">&larr; Назад к списку</button>

        <div className="theme-card rounded-2xl border border-border bg-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">#{t.id} {t.subject}</h2>
              <p className="mt-1 text-sm text-muted">
                {t.user_email} {t.user_telegram_id ? `(TG: ${t.user_telegram_id})` : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip size="sm" color={STATUS_MAP[t.status]?.color}>{STATUS_MAP[t.status]?.label}</Chip>
              <Chip size="sm" color={PRIORITY_MAP[t.priority]?.color}>{PRIORITY_MAP[t.priority]?.label}</Chip>
              <Chip size="sm" variant="flat">{CATEGORY_MAP[t.category] || t.category}</Chip>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {!t.assigned_to_id && (
              <Button size="sm" variant="outline" onPress={handleAssignMe}>Взять себе</Button>
            )}
            {t.assigned_to_email && (
              <span className="text-xs text-muted">Назначен: {t.assigned_to_email}</span>
            )}
          </div>

          {/* Status buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            {['open', 'in_progress', 'waiting', 'resolved', 'closed'].map(s => (
              <Button key={s} size="sm"
                variant={t.status === s ? 'solid' : 'outline'}
                color={STATUS_MAP[s]?.color}
                onPress={() => handleStatusChange(s)}
              >{STATUS_MAP[s]?.label}</Button>
            ))}
          </div>
        </div>

        {/* User subscription context */}
        {t.user_subscription && (
          <div className="theme-card rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-semibold text-muted">Подписка пользователя</p>
            <p className="mt-1 text-sm text-foreground">
              {t.user_subscription.plan} — до {new Date(t.user_subscription.expires_at).toLocaleDateString('ru')}
              <span className="ml-2 text-xs text-muted">{t.user_subscription.status}</span>
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-3">
          {(t.messages || []).map(m => (
            <div key={m.id} className={`rounded-xl border p-4 ${
              m.is_staff
                ? 'border-accent/30 bg-accent/5 ml-8'
                : 'border-border bg-surface mr-8'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">
                  {m.is_staff ? `Поддержка (${m.sender_email || 'staff'})` : t.user_email}
                </span>
                <span className="text-xs text-muted">
                  {new Date(m.created_at).toLocaleString('ru')}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{m.text}</p>
              {m.telegram_message_id && (
                <span className="mt-1 text-[10px] text-muted">TG msg #{m.telegram_message_id}</span>
              )}
            </div>
          ))}
        </div>

        {/* Reply box */}
        {t.status !== 'closed' && (
          <div className="theme-card rounded-xl border border-border bg-surface p-4">
            <textarea
              className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              rows={3}
              placeholder="Ответ пользователю... (отправится в Telegram)"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
            <div className="mt-2 flex gap-2">
              <Button size="sm" color="primary" onPress={handleReply}
                isDisabled={!replyText.trim()} isPending={replying}>
                Отправить
              </Button>
              <Button size="sm" variant="outline"
                onPress={() => { handleReply(); handleStatusChange('resolved') }}
                isDisabled={!replyText.trim()} isPending={replying}>
                Отправить и решить
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // List view
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <h1 className="font-heading text-2xl font-bold text-foreground">Поддержка</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { label: 'Открытые', value: stats.open, color: 'text-warning' },
            { label: 'В работе', value: stats.in_progress, color: 'text-primary' },
            { label: 'Ожидание', value: stats.waiting, color: 'text-muted' },
            { label: 'Решено сегодня', value: stats.resolved_today, color: 'text-success' },
            { label: 'Всего', value: stats.total, color: 'text-foreground' },
          ].map(s => (
            <div key={s.label} className="theme-card rounded-xl border border-border bg-surface p-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Input
          size="sm" placeholder="Поиск по теме или email..."
          className="max-w-xs"
          value={filter.search}
          onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
        />
        {['', 'open', 'in_progress', 'waiting', 'resolved', 'closed'].map(s => (
          <Button key={s} size="sm"
            variant={filter.status === s ? 'solid' : 'outline'}
            onPress={() => setFilter(f => ({ ...f, status: s }))}
          >{s ? STATUS_MAP[s]?.label : 'Все'}</Button>
        ))}
      </div>

      {/* Ticket list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="current" className="text-accent" />
        </div>
      ) : tickets.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">Нет тикетов</p>
      ) : (
        <div className="space-y-2">
          {tickets.map(t => (
            <button key={t.id}
              onClick={() => openTicket(t.id)}
              className="w-full rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-accent/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted">#{t.id}</span>
                    <span className="truncate text-sm font-medium text-foreground">{t.subject}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {t.user_email} &middot; {CATEGORY_MAP[t.category] || t.category}
                    &middot; {new Date(t.updated_at).toLocaleString('ru')}
                    &middot; {t.message_count} сообщ.
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Chip size="sm" color={STATUS_MAP[t.status]?.color}>{STATUS_MAP[t.status]?.label}</Chip>
                  <Chip size="sm" color={PRIORITY_MAP[t.priority]?.color}>{PRIORITY_MAP[t.priority]?.label}</Chip>
                </div>
              </div>
              {t.last_message && (
                <p className="mt-2 truncate text-xs text-muted">
                  {t.last_message.is_staff ? '↩ Поддержка: ' : ''}
                  {t.last_message.text}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <div className="flex justify-center gap-2">
          <span className="text-xs text-muted">Стр. {meta.page} из {meta.total_pages} ({meta.total} тикетов)</span>
        </div>
      )}
    </div>
  )
}
