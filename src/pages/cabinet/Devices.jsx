import { useState, useEffect } from 'react'
import { Button, Chip, Spinner } from '@heroui/react'
import { motion } from 'motion/react'
import { getMySubscription, getHwidDevices } from '../../api/subscriptions'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate } from 'react-router-dom'

function DeviceIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-10 w-10 ${filled ? 'text-accent' : 'text-muted/20'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <rect x="5" y="2" width="14" height="17" rx="2" />
      <line x1="12" y1="22" x2="12" y2="19" />
      <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function truncateHwid(hwid) {
  if (!hwid) return '---'
  if (hwid.length <= 12) return hwid
  return hwid.slice(0, 6) + '...' + hwid.slice(-4)
}

function formatDate(iso) {
  if (!iso) return '---'
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Devices() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [sub, setSub] = useState(null)
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [devicesLoading, setDevicesLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMySubscription()
      .then(async (data) => {
        const subscription = data?.subscription
        setSub(subscription)

        const uuid = user?.remnawave_uuid
        if (uuid) {
          setDevicesLoading(true)
          try {
            const result = await getHwidDevices(uuid)
            const deviceList = result?.response || result?.devices || result
            setDevices(Array.isArray(deviceList) ? deviceList : [])
          } catch {
            setDevices([])
          } finally {
            setDevicesLoading(false)
          }
        }
      })
      .catch(err => setError(err.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  const planDevices = sub?.plan_devices || 0
  const hwidLimit = sub?.remnawave?.hwid_device_limit ?? planDevices
  const effectiveLimit = hwidLimit === 0 ? planDevices : hwidLimit
  const isUnlimited = hwidLimit === 0

  return (
    <div className="mx-auto max-w-4xl w-full grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      <h1 className="font-heading text-2xl font-bold text-foreground md:col-span-2">Устройства</h1>

      {error ? (
        <div className="md:col-span-2 theme-card rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
          <p className="text-sm text-danger">{error}</p>
        </div>
      ) : !sub ? (
        <div className="md:col-span-2 theme-card rounded-2xl border border-border bg-surface p-5 text-center md:p-6">
          <p className="text-muted">У вас нет активной подписки</p>
          <Button
            className="glow-cyan mt-4 font-semibold"
            onPress={() => navigate('/cabinet/purchase')}
          >
            Выбрать тариф
          </Button>
        </div>
      ) : (
        <>
          {/* Device limit card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="theme-card rounded-2xl border border-border bg-surface p-5 md:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted md:text-[11px]">
                  Лимит устройств
                </p>
                <p className="font-heading mt-1 text-3xl font-bold text-foreground">
                  {isUnlimited ? (
                    <span className="text-accent">Безлимит</span>
                  ) : (
                    <>
                      {devices.length} / {effectiveLimit}{' '}
                      <span className="text-lg font-normal text-muted">устройств</span>
                    </>
                  )}
                </p>
              </div>
              <Chip size="sm" className="bg-accent/12 text-[10px] font-bold text-accent">
                {sub.plan_name}
              </Chip>
            </div>

            {/* Visual device icons */}
            {!isUnlimited && (
              <div className="mt-6 flex flex-wrap gap-3">
                {Array.from({ length: effectiveLimit }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <DeviceIcon filled={i < devices.length} />
                  </motion.div>
                ))}
              </div>
            )}

            {isUnlimited && (
              <div className="mt-6 flex flex-wrap gap-3">
                {Array.from({ length: Math.max(6, devices.length) }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <DeviceIcon filled={i < devices.length} />
                  </motion.div>
                ))}
                <div className="flex items-center">
                  <span className="text-lg text-accent">+...</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Connected devices list */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 theme-card rounded-2xl border border-border bg-surface p-4 md:p-5"
          >
            <p className="mb-3 text-sm font-semibold text-foreground">
              Подключённые устройства
            </p>

            {devicesLoading ? (
              <div className="flex items-center justify-center py-6">
                <Spinner size="sm" />
              </div>
            ) : devices.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">
                Нет подключённых устройств
              </p>
            ) : (
              <div className="space-y-2">
                {devices.map((device, i) => (
                  <motion.div
                    key={device.id || device.hwid || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between rounded-xl border border-border theme-subtle-bg px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {device.deviceName || device.device_name || device.remark || `Устройство ${i + 1}`}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted">
                        HWID: {truncateHwid(device.hwid || device.hwidHash || device.hwid_hash)}
                      </p>
                    </div>
                    <div className="ml-3 shrink-0 text-right">
                      <p className="text-[11px] text-muted">
                        {formatDate(device.firstConnectedAt || device.first_connected_at || device.createdAt || device.created_at)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Plan comparison */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="theme-card rounded-2xl border border-border bg-surface p-4 md:p-5"
          >
            <p className="mb-3 text-sm font-semibold text-foreground">Лимиты по тарифам</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { name: 'Standard', devices: 3 },
                { name: 'Pro', devices: 4 },
                { name: 'Max', devices: 6 },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl border p-3 ${
                    sub.plan_name === plan.name
                      ? 'border-accent/30 bg-accent/[0.06]'
                      : 'border-border theme-subtle-bg'
                  }`}
                >
                  <p className="text-xs font-semibold text-foreground">{plan.name}</p>
                  <p className="mt-1 text-lg font-bold text-accent">{plan.devices}</p>
                  <p className="text-[11px] text-muted">устройств</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 theme-card-accent rounded-2xl border border-accent/10 bg-accent/[0.04] p-4 md:p-5"
          >
            <p className="mb-2 text-sm font-semibold text-foreground">
              Как работает лимит устройств?
            </p>
            <div className="space-y-2 text-[13px] text-muted">
              <p>
                Лимит устройств определяет, сколько разных устройств могут одновременно
                использовать вашу VPN-подписку. Каждое устройство привязывается автоматически
                при первом подключении.
              </p>
              <p>
                Если вы достигли лимита и хотите подключить новое устройство, вам нужно
                освободить слот. Это можно сделать через поддержку или пересоздание подписки.
              </p>
              <p>
                Для увеличения лимита устройств перейдите на более старший тариф.
              </p>
            </div>
            {sub.plan !== 'max' && (
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onPress={() => navigate('/cabinet/purchase')}
              >
                Повысить тариф
              </Button>
            )}
          </motion.div>
        </>
      )}
    </div>
  )
}
