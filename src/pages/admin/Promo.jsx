import { useState, useEffect } from 'react'
import { Spinner, Button, Input } from '@heroui/react'
import { motion } from 'motion/react'
import { getAdminPromos, createPromo, updatePromo } from '../../api/admin'

export default function Promo() {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState(null)

  // Form state
  const [code, setCode] = useState('')
  const [type, setType] = useState('percent')
  const [value, setValue] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [planFilter, setPlanFilter] = useState('')

  // Inline edit
  const [editId, setEditId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [editMaxUses, setEditMaxUses] = useState('')

  function loadPromos() {
    setLoading(true)
    getAdminPromos()
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.results ?? []
        setPromos(items)
      })
      .catch(() => setPromos([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPromos()
  }, [])

  function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)]
    setCode(result)
  }

  async function handleCreate() {
    if (!code.trim() || !value) return
    setSaving(true)
    setSaveMsg(null)
    try {
      const data = {
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        max_uses: maxUses ? Number(maxUses) : 0,
        valid_until: validUntil || null,
        plan: planFilter || null,
      }
      await createPromo(data)
      setSaveMsg({ ok: true, text: 'Promo created' })
      setCode('')
      setValue('')
      setMaxUses('')
      setValidUntil('')
      setPlanFilter('')
      loadPromos()
    } catch (err) {
      setSaveMsg({ ok: false, text: `Error: ${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  async function handleDeactivate(promo) {
    try {
      await updatePromo(promo.id, { is_active: false })
      loadPromos()
    } catch {
      // silent
    }
  }

  async function handleSaveEdit(promo) {
    try {
      await updatePromo(promo.id, {
        value: Number(editValue),
        max_uses: editMaxUses ? Number(editMaxUses) : 0,
      })
      setEditId(null)
      loadPromos()
    } catch {
      // silent
    }
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="font-heading text-xl font-bold text-foreground">Promo Codes</h1>

      {/* Create form (collapsible) */}
      <div className="rounded-xl border border-border bg-surface">
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="flex w-full items-center justify-between p-4 text-sm font-semibold text-foreground"
        >
          <span>Create Promo Code</span>
          <span className="text-xs text-muted">{formOpen ? 'Collapse' : 'Expand'}</span>
        </button>

        {formOpen && (
          <div className="border-t border-border p-4 space-y-4">
            {/* Code */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <p className="mb-1.5 text-xs text-muted">Code</p>
                <Input
                  value={code}
                  onValueChange={setCode}
                  placeholder="PROMO2024"
                  classNames={{ inputWrapper: 'border-border bg-surface' }}
                />
              </div>
              <Button size="sm" variant="flat" onClick={generateCode}>
                Generate random
              </Button>
            </div>

            {/* Type toggle */}
            <div>
              <p className="mb-1.5 text-xs text-muted">Type</p>
              <div className="flex gap-1">
                {['percent', 'days'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                      type === t
                        ? 'bg-accent/12 text-accent'
                        : 'bg-surface text-muted hover:text-foreground border border-border'
                    }`}
                  >
                    {t === 'percent' ? 'Percent' : 'Days'}
                  </button>
                ))}
              </div>
            </div>

            {/* Value + Max uses */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-xs text-muted">Value {type === 'percent' ? '(%)' : '(days)'}</p>
                <Input
                  type="number"
                  value={value}
                  onValueChange={setValue}
                  placeholder={type === 'percent' ? '20' : '30'}
                  classNames={{ inputWrapper: 'border-border bg-surface' }}
                />
              </div>
              <div>
                <p className="mb-1.5 text-xs text-muted">Max Uses (0 = unlimited)</p>
                <Input
                  type="number"
                  value={maxUses}
                  onValueChange={setMaxUses}
                  placeholder="0"
                  classNames={{ inputWrapper: 'border-border bg-surface' }}
                />
              </div>
            </div>

            {/* Valid until + Plan filter */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-xs text-muted">Valid Until</p>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent/50"
                />
              </div>
              <div>
                <p className="mb-1.5 text-xs text-muted">Plan (optional)</p>
                <Input
                  value={planFilter}
                  onValueChange={setPlanFilter}
                  placeholder="e.g. premium"
                  classNames={{ inputWrapper: 'border-border bg-surface' }}
                />
              </div>
            </div>

            {/* Create button */}
            <div className="flex items-center gap-3">
              <Button color="primary" size="sm" isLoading={saving} onClick={handleCreate} isDisabled={!code.trim() || !value}>
                Create
              </Button>
              {saveMsg && (
                <p className={`text-xs ${saveMsg.ok ? 'text-green-500' : 'text-red-400'}`}>{saveMsg.text}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground mb-4">All Promo Codes</p>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : promos.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">No promo codes yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="pb-2 pr-3 font-medium">Code</th>
                  <th className="pb-2 pr-3 font-medium">Type</th>
                  <th className="pb-2 pr-3 font-medium">Value</th>
                  <th className="pb-2 pr-3 font-medium">Used/Max</th>
                  <th className="pb-2 pr-3 font-medium">Valid Until</th>
                  <th className="pb-2 pr-3 font-medium">Plan</th>
                  <th className="pb-2 pr-3 font-medium">Active</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promos.map((p) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-2 pr-3 font-mono text-xs text-foreground">{p.code}</td>
                    <td className="py-2 pr-3 text-xs text-muted capitalize">{p.type ?? '—'}</td>
                    <td className="py-2 pr-3 text-xs text-foreground">
                      {editId === p.id ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-16 rounded border border-border bg-surface px-1.5 py-0.5 text-xs text-foreground"
                        />
                      ) : (
                        <>
                          {p.value}{p.type === 'percent' ? '%' : ' days'}
                        </>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-xs text-foreground">
                      {editId === p.id ? (
                        <input
                          type="number"
                          value={editMaxUses}
                          onChange={(e) => setEditMaxUses(e.target.value)}
                          className="w-16 rounded border border-border bg-surface px-1.5 py-0.5 text-xs text-foreground"
                        />
                      ) : (
                        <>
                          {p.used ?? 0}/{p.max_uses === 0 ? '\u221E' : p.max_uses}
                        </>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-xs text-muted">
                      {p.valid_until ? new Date(p.valid_until).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-2 pr-3 text-xs text-muted">{p.plan || '—'}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                          p.is_active ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2 text-xs">
                      {editId === p.id ? (
                        <div className="flex gap-1">
                          <Button size="sm" variant="flat" onClick={() => handleSaveEdit(p)}>
                            Save
                          </Button>
                          <Button size="sm" variant="light" onClick={() => setEditId(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="light"
                            onClick={() => {
                              setEditId(p.id)
                              setEditValue(String(p.value ?? ''))
                              setEditMaxUses(String(p.max_uses ?? ''))
                            }}
                          >
                            Edit
                          </Button>
                          {p.is_active && (
                            <Button size="sm" variant="light" color="danger" onClick={() => handleDeactivate(p)}>
                              Deactivate
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}
