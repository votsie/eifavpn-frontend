import { useState, useEffect, useMemo } from 'react'
import { Input, Chip, Spinner } from '@heroui/react'
import { Magnifier } from '@gravity-ui/icons'
import { motion } from 'motion/react'
import { getMySubscription, getAccessibleNodes } from '../../api/subscriptions'

const COUNTRY_FLAGS = {
  russia: '\u{1F1F7}\u{1F1FA}', ru: '\u{1F1F7}\u{1F1FA}', '\u{420}\u{43e}\u{441}\u{441}\u{438}\u{44f}': '\u{1F1F7}\u{1F1FA}',
  germany: '\u{1F1E9}\u{1F1EA}', de: '\u{1F1E9}\u{1F1EA}', '\u{413}\u{435}\u{440}\u{43c}\u{430}\u{43d}\u{438}\u{44f}': '\u{1F1E9}\u{1F1EA}',
  netherlands: '\u{1F1F3}\u{1F1F1}', nl: '\u{1F1F3}\u{1F1F1}', '\u{41d}\u{438}\u{434}\u{435}\u{440}\u{43b}\u{430}\u{43d}\u{434}\u{44b}': '\u{1F1F3}\u{1F1F1}',
  usa: '\u{1F1FA}\u{1F1F8}', us: '\u{1F1FA}\u{1F1F8}', '\u{421}\u{428}\u{410}': '\u{1F1FA}\u{1F1F8}',
  finland: '\u{1F1EB}\u{1F1EE}', fi: '\u{1F1EB}\u{1F1EE}', '\u{424}\u{438}\u{43d}\u{43b}\u{44f}\u{43d}\u{434}\u{438}\u{44f}': '\u{1F1EB}\u{1F1EE}',
  turkey: '\u{1F1F9}\u{1F1F7}', tr: '\u{1F1F9}\u{1F1F7}', '\u{422}\u{443}\u{440}\u{446}\u{438}\u{44f}': '\u{1F1F9}\u{1F1F7}',
  france: '\u{1F1EB}\u{1F1F7}', fr: '\u{1F1EB}\u{1F1F7}', '\u{424}\u{440}\u{430}\u{43d}\u{446}\u{438}\u{44f}': '\u{1F1EB}\u{1F1F7}',
  uk: '\u{1F1EC}\u{1F1E7}', gb: '\u{1F1EC}\u{1F1E7}', '\u{412}\u{435}\u{43b}\u{438}\u{43a}\u{43e}\u{431}\u{440}\u{438}\u{442}\u{430}\u{43d}\u{438}\u{44f}': '\u{1F1EC}\u{1F1E7}',
  japan: '\u{1F1EF}\u{1F1F5}', jp: '\u{1F1EF}\u{1F1F5}', '\u{42F}\u{43f}\u{43e}\u{43d}\u{438}\u{44f}': '\u{1F1EF}\u{1F1F5}',
  singapore: '\u{1F1F8}\u{1F1EC}', sg: '\u{1F1F8}\u{1F1EC}', '\u{421}\u{438}\u{43d}\u{433}\u{430}\u{43f}\u{443}\u{440}': '\u{1F1F8}\u{1F1EC}',
  canada: '\u{1F1E8}\u{1F1E6}', ca: '\u{1F1E8}\u{1F1E6}', '\u{41a}\u{430}\u{43d}\u{430}\u{434}\u{430}': '\u{1F1E8}\u{1F1E6}',
  poland: '\u{1F1F5}\u{1F1F1}', pl: '\u{1F1F5}\u{1F1F1}', '\u{41f}\u{43e}\u{43b}\u{44c}\u{448}\u{430}': '\u{1F1F5}\u{1F1F1}',
  sweden: '\u{1F1F8}\u{1F1EA}', se: '\u{1F1F8}\u{1F1EA}', '\u{428}\u{432}\u{435}\u{446}\u{438}\u{44f}': '\u{1F1F8}\u{1F1EA}',
  australia: '\u{1F1E6}\u{1F1FA}', au: '\u{1F1E6}\u{1F1FA}', '\u{410}\u{432}\u{441}\u{442}\u{440}\u{430}\u{43b}\u{438}\u{44f}': '\u{1F1E6}\u{1F1FA}',
  kazakhstan: '\u{1F1F0}\u{1F1FF}', kz: '\u{1F1F0}\u{1F1FF}', '\u{41a}\u{430}\u{437}\u{430}\u{445}\u{441}\u{442}\u{430}\u{43d}': '\u{1F1F0}\u{1F1FF}',
  brazil: '\u{1F1E7}\u{1F1F7}', br: '\u{1F1E7}\u{1F1F7}',
  india: '\u{1F1EE}\u{1F1F3}', 'in': '\u{1F1EE}\u{1F1F3}',
  italy: '\u{1F1EE}\u{1F1F9}', it: '\u{1F1EE}\u{1F1F9}',
  spain: '\u{1F1EA}\u{1F1F8}', es: '\u{1F1EA}\u{1F1F8}',
  austria: '\u{1F1E6}\u{1F1F9}', at: '\u{1F1E6}\u{1F1F9}',
  latvia: '\u{1F1F1}\u{1F1FB}', lv: '\u{1F1F1}\u{1F1FB}',
}

function getFlag(name) {
  const lower = (name || '').toLowerCase()
  for (const [key, flag] of Object.entries(COUNTRY_FLAGS)) {
    if (lower.includes(key)) return flag
  }
  return '\u{1F310}'
}

function getCountryName(name) {
  const lower = (name || '').toLowerCase()
  const countries = {
    russia: '\u{420}\u{43e}\u{441}\u{441}\u{438}\u{44f}', ru: '\u{420}\u{43e}\u{441}\u{441}\u{438}\u{44f}',
    germany: '\u{413}\u{435}\u{440}\u{43c}\u{430}\u{43d}\u{438}\u{44f}', de: '\u{413}\u{435}\u{440}\u{43c}\u{430}\u{43d}\u{438}\u{44f}',
    netherlands: '\u{41d}\u{438}\u{434}\u{435}\u{440}\u{43b}\u{430}\u{43d}\u{434}\u{44b}', nl: '\u{41d}\u{438}\u{434}\u{435}\u{440}\u{43b}\u{430}\u{43d}\u{434}\u{44b}',
    usa: '\u{421}\u{428}\u{410}', us: '\u{421}\u{428}\u{410}', 'united states': '\u{421}\u{428}\u{410}',
    finland: '\u{424}\u{438}\u{43d}\u{43b}\u{44f}\u{43d}\u{434}\u{438}\u{44f}', fi: '\u{424}\u{438}\u{43d}\u{43b}\u{44f}\u{43d}\u{434}\u{438}\u{44f}',
    turkey: '\u{422}\u{443}\u{440}\u{446}\u{438}\u{44f}', tr: '\u{422}\u{443}\u{440}\u{446}\u{438}\u{44f}',
    france: '\u{424}\u{440}\u{430}\u{43d}\u{446}\u{438}\u{44f}', fr: '\u{424}\u{440}\u{430}\u{43d}\u{446}\u{438}\u{44f}',
    uk: '\u{412}\u{435}\u{43b}\u{438}\u{43a}\u{43e}\u{431}\u{440}\u{438}\u{442}\u{430}\u{43d}\u{438}\u{44f}', gb: '\u{412}\u{435}\u{43b}\u{438}\u{43a}\u{43e}\u{431}\u{440}\u{438}\u{442}\u{430}\u{43d}\u{438}\u{44f}',
    japan: '\u{42F}\u{43f}\u{43e}\u{43d}\u{438}\u{44f}', jp: '\u{42F}\u{43f}\u{43e}\u{43d}\u{438}\u{44f}',
    singapore: '\u{421}\u{438}\u{43d}\u{433}\u{430}\u{43f}\u{443}\u{440}', sg: '\u{421}\u{438}\u{43d}\u{433}\u{430}\u{43f}\u{443}\u{440}',
    canada: '\u{41a}\u{430}\u{43d}\u{430}\u{434}\u{430}', ca: '\u{41a}\u{430}\u{43d}\u{430}\u{434}\u{430}',
    poland: '\u{41f}\u{43e}\u{43b}\u{44c}\u{448}\u{430}', pl: '\u{41f}\u{43e}\u{43b}\u{44c}\u{448}\u{430}',
    sweden: '\u{428}\u{432}\u{435}\u{446}\u{438}\u{44f}', se: '\u{428}\u{432}\u{435}\u{446}\u{438}\u{44f}',
    australia: '\u{410}\u{432}\u{441}\u{442}\u{440}\u{430}\u{43b}\u{438}\u{44f}', au: '\u{410}\u{432}\u{441}\u{442}\u{440}\u{430}\u{43b}\u{438}\u{44f}',
    kazakhstan: '\u{41a}\u{430}\u{437}\u{430}\u{445}\u{441}\u{442}\u{430}\u{43d}', kz: '\u{41a}\u{430}\u{437}\u{430}\u{445}\u{441}\u{442}\u{430}\u{43d}',
    brazil: '\u{411}\u{440}\u{430}\u{437}\u{438}\u{43b}\u{438}\u{44f}', br: '\u{411}\u{440}\u{430}\u{437}\u{438}\u{43b}\u{438}\u{44f}',
    india: '\u{418}\u{43d}\u{434}\u{438}\u{44f}',
    italy: '\u{418}\u{442}\u{430}\u{43b}\u{438}\u{44f}', it: '\u{418}\u{442}\u{430}\u{43b}\u{438}\u{44f}',
    spain: '\u{418}\u{441}\u{43f}\u{430}\u{43d}\u{438}\u{44f}', es: '\u{418}\u{441}\u{43f}\u{430}\u{43d}\u{438}\u{44f}',
    austria: '\u{410}\u{432}\u{441}\u{442}\u{440}\u{438}\u{44f}', at: '\u{410}\u{432}\u{441}\u{442}\u{440}\u{438}\u{44f}',
    latvia: '\u{41b}\u{430}\u{442}\u{432}\u{438}\u{44f}', lv: '\u{41b}\u{430}\u{442}\u{432}\u{438}\u{44f}',
  }
  for (const [key, label] of Object.entries(countries)) {
    if (lower.includes(key)) return label
  }
  return name || '\u{41d}\u{435}\u{438}\u{437}\u{432}\u{435}\u{441}\u{442}\u{43d}\u{43e}'
}

export default function Servers() {
  const [nodes, setNodes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [lastNodeUuid, setLastNodeUuid] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getMySubscription()
        const sub = data?.subscription
        const uuid = sub?.remnawave?.uuid || sub?.remnawave_uuid

        if (sub?.remnawave?.last_node_uuid) {
          setLastNodeUuid(sub.remnawave.last_node_uuid)
        }

        if (uuid) {
          const result = await getAccessibleNodes(uuid)
          const nodeList = result?.response || result?.nodes || result
          setNodes(Array.isArray(nodeList) ? nodeList : [])
        }
      } catch {
        setNodes([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // Build server list from nodes
  const servers = useMemo(() => {
    if (!Array.isArray(nodes)) return []

    return nodes.map((node) => {
      const remark = node.name || node.remark || ''
      const displayName = remark
      const flag = getFlag(displayName)
      const country = getCountryName(displayName)

      return {
        uuid: node.uuid,
        name: displayName,
        flag,
        country,
        isConnected: node.isConnected ?? node.is_connected ?? false,
        usersOnline: node.usersOnline ?? node.users_online ?? 0,
        isCurrentNode: lastNodeUuid && node.uuid === lastNodeUuid,
      }
    })
  }, [nodes, lastNodeUuid])

  const filtered = useMemo(() => {
    if (!search.trim()) return servers
    const q = search.toLowerCase()
    return servers.filter(
      (s) => s.country.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
    )
  }, [servers, search])

  return (
    <div className="mx-auto max-w-3xl w-full space-y-3 overflow-hidden md:space-y-5">
      <h1 className="font-heading text-2xl font-bold text-foreground">Серверы</h1>

      {/* Search */}
      <Input
        placeholder="Поиск по стране или имени..."
        value={search}
        onValueChange={setSearch}
        startContent={<Magnifier className="h-4 w-4 text-muted" />}
        classNames={{
          inputWrapper: 'glass-card border-white/[0.06] bg-surface/40',
        }}
      />

      {/* Loading */}
      {isLoading && servers.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Server grid */}
      {filtered.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((server, i) => (
            <motion.div
              key={server.uuid}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`relative rounded-2xl border p-4 transition-all ${
                server.isCurrentNode
                  ? 'glass-card-accent border-accent/30 bg-accent/[0.06] shadow-[0_0_20px_oklch(0.80_0.155_180/12%)]'
                  : 'glass-card border-white/[0.06] bg-surface/40'
              }`}
            >
              {server.isCurrentNode && (
                <Chip
                  size="sm"
                  className="absolute -top-2 right-3 bg-accent/15 text-[10px] font-bold text-accent"
                >
                  Текущий
                </Chip>
              )}

              <div className="flex items-center gap-3">
                <span className="text-3xl">{server.flag}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{server.country}</p>
                  <p className="truncate text-xs text-muted">{server.name}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      server.isConnected ? 'bg-accent shadow-[0_0_6px_oklch(0.80_0.155_180/50%)]' : 'bg-danger/60'
                    }`}
                  />
                  <span className="text-xs text-muted">
                    {server.isConnected ? 'Онлайн' : 'Офлайн'}
                  </span>
                </div>
                {server.usersOnline > 0 && (
                  <span className="text-xs text-muted">
                    {server.usersOnline} польз.
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="glass-card rounded-2xl border border-white/[0.06] bg-surface/40 p-8 text-center">
          <p className="text-muted">
            {search ? 'Серверы не найдены по вашему запросу' : 'Нет доступных серверов'}
          </p>
        </div>
      )}
    </div>
  )
}
