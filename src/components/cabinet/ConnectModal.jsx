import { useState } from 'react'
import { Button } from '@heroui/react'
import { motion, AnimatePresence } from 'motion/react'

const HAPP_LINKS = {
  phone: {
    iphone: [
      { label: 'App Store (RU)', url: 'https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973', icon: '🍎' },
      { label: 'App Store (Global)', url: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215', icon: '🌍' },
    ],
    android: [
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.happproxy', icon: '▶️' },
      { label: 'Скачать APK', url: '/download/android', external: true, icon: '📦' },
    ],
  },
  computer: {
    windows: [
      { label: 'Скачать EXE', url: '/download/windows', external: true, icon: '💿' },
    ],
    macos: [
      { label: 'App Store (RU)', url: 'https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973', icon: '🍎' },
      { label: 'App Store (Global)', url: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215', icon: '🌍' },
      { label: 'Скачать DMG', url: '/download/macos', external: true, icon: '💿' },
    ],
    linux: [
      { label: 'DEB (Ubuntu/Debian)', url: '/download/linux?format=deb', external: true, icon: '🐧' },
      { label: 'RPM (Fedora/RHEL)', url: '/download/linux?format=rpm', external: true, icon: '🎩' },
      { label: 'PKG (Arch)', url: '/download/linux?format=pkg', external: true, icon: '📦' },
    ],
  },
  tv: {
    android_tv: [
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.happproxy', icon: '▶️' },
      { label: 'Скачать APK', url: '/download/android', external: true, icon: '📦' },
    ],
    apple_tv: [
      { label: 'App Store', url: 'https://apps.apple.com/us/app/happ-proxy-utility-for-tv/id6748297274', icon: '🍎' },
    ],
  },
}

const DEVICES = [
  { key: 'phone', label: 'Телефон', icon: '📱' },
  { key: 'computer', label: 'Компьютер', icon: '💻' },
  { key: 'tv', label: 'ТВ', icon: '📺' },
]

const PLATFORMS = {
  iphone: 'iPhone', android: 'Android',
  windows: 'Windows', macos: 'macOS', linux: 'Linux',
  android_tv: 'Android TV', apple_tv: 'Apple TV',
}

function isTg() { return !!window.Telegram?.WebApp?.initData }

function openLink(url, external) {
  const fullUrl = external ? window.location.origin + url : url
  if (isTg()) {
    window.Telegram.WebApp.openLink(fullUrl)
  } else {
    window.open(fullUrl, '_blank')
  }
}

export default function ConnectModal({ isOpen, onClose, subscriptionUrl }) {
  const [step, setStep] = useState('choice')
  const [device, setDevice] = useState(null)
  const [platform, setPlatform] = useState(null)

  function reset() { setStep('choice'); setDevice(null); setPlatform(null) }
  function close() { reset(); onClose() }

  function connect() {
    const url = `happ://add/${subscriptionUrl}`
    if (isTg()) {
      window.Telegram.WebApp.openLink(url)
    } else {
      window.location.href = url
      // Fallback — open connect page after delay
      setTimeout(() => { window.open(`/connect?url=${encodeURIComponent(subscriptionUrl)}`, '_blank') }, 1500)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Drawer */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[101] max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-white/[0.1] bg-surface/95 p-5 pb-8 backdrop-blur-2xl md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[80vh] md:w-full md:max-w-md md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:border md:p-6"
            style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
          >
            {/* Handle bar (mobile) */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/10 md:hidden" />

            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">
                {step === 'choice' && 'Подключение VPN'}
                {step === 'device' && 'Выберите устройство'}
                {step === 'platform' && 'Выберите платформу'}
                {step === 'links' && `HAPP для ${PLATFORMS[platform]}`}
                {step === 'connect' && 'Подключиться'}
              </h2>
              <button onClick={close} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-muted transition-colors hover:bg-white/[0.1] hover:text-foreground">
                ✕
              </button>
            </div>

            <AnimatePresence mode="wait">
              {/* Step: Choice */}
              {step === 'choice' && (
                <motion.div key="choice" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-3">
                  <p className="text-sm text-muted">Для подключения нужно приложение HAPP.</p>
                  <button
                    onClick={() => setStep('device')}
                    className="flex w-full items-center gap-4 rounded-2xl border border-accent/15 bg-accent/[0.06] p-4 text-left transition-all hover:bg-accent/[0.1]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-2xl">⬇️</span>
                    <div>
                      <p className="font-semibold text-foreground">Установить HAPP</p>
                      <p className="text-xs text-muted">Скачать приложение для вашего устройства</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setStep('connect')}
                    className="flex w-full items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-left transition-all hover:bg-white/[0.06]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06] text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-foreground">У меня есть HAPP</p>
                      <p className="text-xs text-muted">Подключить подписку к приложению</p>
                    </div>
                  </button>
                </motion.div>
              )}

              {/* Step: Device type */}
              {step === 'device' && (
                <motion.div key="device" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {DEVICES.map((d) => (
                      <button
                        key={d.key}
                        onClick={() => { setDevice(d.key); setStep('platform') }}
                        className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all hover:border-accent/20 hover:bg-accent/[0.06]"
                      >
                        <span className="text-3xl">{d.icon}</span>
                        <span className="text-xs font-medium text-foreground">{d.label}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={reset} className="text-[13px] text-muted hover:text-foreground">← Назад</button>
                </motion.div>
              )}

              {/* Step: Platform */}
              {step === 'platform' && device && (
                <motion.div key="platform" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(HAPP_LINKS[device] || {}).map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPlatform(p); setStep('links') }}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 text-sm font-medium text-foreground transition-all hover:border-accent/20 hover:bg-accent/[0.06]"
                      >
                        {PLATFORMS[p]}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => { setDevice(null); setStep('device') }} className="text-[13px] text-muted hover:text-foreground">← Назад</button>
                </motion.div>
              )}

              {/* Step: Download links */}
              {step === 'links' && platform && (
                <motion.div key="links" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-3">
                  {(HAPP_LINKS[device]?.[platform] || []).map((link, i) => (
                    <button
                      key={i}
                      onClick={() => openLink(link.url, link.external)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-left transition-all hover:border-accent/20 hover:bg-accent/[0.06]"
                    >
                      <span className="text-xl">{link.icon}</span>
                      <span className="text-sm font-medium text-foreground">{link.label}</span>
                    </button>
                  ))}
                  <div className="flex items-center gap-3 pt-2">
                    <button onClick={() => { setPlatform(null); setStep('platform') }} className="text-[13px] text-muted hover:text-foreground">← Назад</button>
                    <Button size="sm" className="glow-cyan ml-auto font-semibold" onPress={() => setStep('connect')}>
                      Уже скачал →
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step: Connect */}
              {step === 'connect' && (
                <motion.div key="connect" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-4">
                  <p className="text-sm text-muted">Нажмите кнопку чтобы добавить подписку в HAPP:</p>
                  <Button fullWidth size="lg" className="glow-cyan h-14 text-base font-bold" onPress={connect}>
                    🚀 Подключиться в HAPP
                  </Button>
                  <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-muted">URL подписки</p>
                    <code className="block truncate text-xs text-accent">{subscriptionUrl}</code>
                  </div>
                  <p className="text-center text-[11px] text-muted/60">
                    Если HAPP не открылся, скопируйте URL и вставьте вручную в приложение
                  </p>
                  <button onClick={() => { setStep('device') }} className="text-[13px] text-muted hover:text-foreground">← Скачать HAPP</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
