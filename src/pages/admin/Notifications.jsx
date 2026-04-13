import { useState, useEffect } from 'react'
import { Spinner, Button, Input } from '@heroui/react'
import { motion } from 'motion/react'
import { sendNotification, getNotificationHistory } from '../../api/admin'

const CHANNELS = ['email', 'telegram']
const SEGMENTS = [
  { value: 'all', label: 'All Users' },
  { value: 'active', label: 'Active Subscribers' },
  { value: 'expiring', label: 'Expiring Soon' },
  { value: 'trial', label: 'Trial Users' },
]

export default function Notifications() {
  const [channel, setChannel] = useState('email')
  const [segment, setSegment] = useState('all')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState(null)

  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  function loadHistory(p = 1) {
    setHistoryLoading(true)
    getNotificationHistory({ page: p })
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.results ?? []
        setHistory(items)
        setTotalPages(res?.total_pages ?? (Math.ceil((res?.count ?? items.length) / 20) || 1))
        setPage(p)
      })
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false))
  }

  useEffect(() => {
    loadHistory()
  }, [])

  async function handleSend() {
    if (!message.trim()) return
    setSending(true)
    setSendResult(null)
    try {
      await sendNotification({ channel, segment, subject, message })
      setSendResult({ ok: true, text: 'Notification sent successfully' })
      setSubject('')
      setMessage('')
      loadHistory()
    } catch (err) {
      setSendResult({ ok: false, text: `Error: ${err.message}` })
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Notifications</h1>

      {/* Section 1: Send Notification */}
      <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
        <p className="text-sm font-semibold text-foreground">Send Notification</p>

        {/* Channel selector */}
        <div>
          <p className="mb-1.5 text-xs text-muted">Channel</p>
          <div className="flex gap-1">
            {CHANNELS.map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                  channel === ch
                    ? 'bg-accent/12 text-accent'
                    : 'bg-surface text-muted hover:text-foreground border border-border'
                }`}
              >
                {ch === 'email' ? 'Email' : 'Telegram'}
              </button>
            ))}
          </div>
        </div>

        {/* Segment selector */}
        <div>
          <p className="mb-1.5 text-xs text-muted">Segment</p>
          <div className="flex flex-wrap gap-1">
            {SEGMENTS.map((seg) => (
              <button
                key={seg.value}
                onClick={() => setSegment(seg.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  segment === seg.value
                    ? 'bg-accent/12 text-accent'
                    : 'bg-surface text-muted hover:text-foreground border border-border'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject (for email) */}
        {channel === 'email' && (
          <div>
            <p className="mb-1.5 text-xs text-muted">Subject</p>
            <Input
              value={subject}
              onValueChange={setSubject}
              placeholder="Notification subject..."
              classNames={{ inputWrapper: 'border-border bg-surface' }}
            />
          </div>
        )}

        {/* Message */}
        <div>
          <p className="mb-1.5 text-xs text-muted">Message</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your notification message..."
            rows={4}
            className="w-full rounded-xl border border-border bg-surface p-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
        </div>

        {/* Send */}
        <div className="flex items-center gap-3">
          <Button
            color="primary"
            size="sm"
            isLoading={sending}
            onClick={handleSend}
            isDisabled={!message.trim()}
          >
            Send Notification
          </Button>
          {sendResult && (
            <p className={`text-xs ${sendResult.ok ? 'text-green-500' : 'text-red-400'}`}>
              {sendResult.text}
            </p>
          )}
        </div>
      </div>

      {/* Section 2: History */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground mb-4">Notification History</p>

        {historyLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : history.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">No notifications sent yet</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted">
                    <th className="pb-2 pr-3 font-medium">Date</th>
                    <th className="pb-2 pr-3 font-medium">Channel</th>
                    <th className="pb-2 pr-3 font-medium">Recipients</th>
                    <th className="pb-2 pr-3 font-medium">Subject</th>
                    <th className="pb-2 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, i) => (
                    <tr key={item.id ?? i} className="border-b border-border/50">
                      <td className="py-2 pr-3 text-xs text-muted whitespace-nowrap">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-2 pr-3">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            item.channel === 'email'
                              ? 'bg-blue-500/15 text-blue-400'
                              : 'bg-accent/15 text-accent'
                          }`}
                        >
                          {item.channel ?? '—'}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-xs text-foreground">{item.recipients ?? item.recipient_count ?? '—'}</td>
                      <td className="py-2 pr-3 text-xs text-foreground">{item.subject || '—'}</td>
                      <td className="py-2 text-xs text-muted max-w-[200px] truncate" title={item.message}>
                        {item.message || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  isDisabled={page <= 1}
                  onClick={() => loadHistory(page - 1)}
                >
                  Prev
                </Button>
                <span className="text-xs text-muted">
                  {page} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="flat"
                  isDisabled={page >= totalPages}
                  onClick={() => loadHistory(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
