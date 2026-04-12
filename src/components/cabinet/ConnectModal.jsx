import { useState } from 'react'
import { Button } from '@heroui/react'
import { motion, AnimatePresence } from 'motion/react'

/* ── SVG line icons (Bootstrap-style, stroke only, accent neon) ── */
const Icon = ({ d, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-accent drop-shadow-[0_0_6px_oklch(0.80_0.155_180/50%)]">
    <path d={d} />
  </svg>
)

const DownloadIcon = () => <Icon d="M12 3v12m0 0l-4-4m4 4l4-4M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
const CheckIcon = () => <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
const PhoneIcon = () => <Icon d="M9 2h6a2 2 0 012 2v16a2 2 0 01-2 2H9a2 2 0 01-2-2V4a2 2 0 012-2zm3 18h.01" />
const LaptopIcon = () => <Icon d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm-2 12h20" />
const TvIcon = () => <Icon d="M3 5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm5 14h8m-4 0v3" />
const AppleIcon = () => <Icon d="M12 2C9.5 2 8 4 8 4s-4 .5-4 5c0 4.5 4 11 6 11 1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 6-6.5 6-11 0-4.5-4-5-4-5s-1.5-2-4-2z" />
const AndroidIcon = () => <Icon d="M5 10v6a1 1 0 001 1h1v3.5a1.5 1.5 0 003 0V17h4v3.5a1.5 1.5 0 003 0V17h1a1 1 0 001-1v-6H5zm2-5l-1.5-2m11 2l1.5-2M7 10h10a5 5 0 00-10 0z" />
const WindowsIcon = () => <Icon d="M3 5.5l7-1v7.5H3V5.5zm0 8.5h7v7.5l-7-1V14zm9-9.5l9-1.5v9H12V4.5zm0 10.5h9v9L12 22.5V15z" />
const LinuxIcon = () => <Icon d="M12 2a4 4 0 00-4 4v2c-2 1-3 3-3 5 0 3 2 5 3 7h8c1-2 3-4 3-7 0-2-1-4-3-5V6a4 4 0 00-4-4zm-1 7h2m-3 3h4" />
const RocketIcon = () => <Icon d="M12 2C6 8 4 14 4 14s2 2 4 2 2.5-1 4-1 2 1 4 1 4-2 4-2-2-6-8-12zm-2 16l-2 2m6-2l2 2" />
const StoreIcon = () => <Icon d="M3 9l1.5-5h15L21 9m-18 0h18M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9M7 9v3m5-3v3m5-3v3" />
const FileIcon = () => <Icon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1v5h5" />
const LinkIcon = () => <Icon d="M10 14a3.5 3.5 0 005 0l3-3a3.5 3.5 0 00-5-5l-.5.5m1 5a3.5 3.5 0 00-5 0l-3 3a3.5 3.5 0 005 5l.5-.5" />
const BackIcon = () => <Icon d="M19 12H5m0 0l7 7m-7-7l7-7" size={16} />

const HAPP_LINKS = {
  phone: {
    iphone: [
      { label: 'App Store (RU)', url: 'https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973', Icon: StoreIcon },
      { label: 'App Store (Global)', url: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215', Icon: StoreIcon },
    ],
    android: [
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.happproxy', Icon: StoreIcon },
      { label: 'Скачать APK', url: '/download/android', external: true, Icon: FileIcon },
    ],
  },
  computer: {
    windows: [{ label: 'Скачать EXE', url: '/download/windows', external: true, Icon: FileIcon }],
    macos: [
      { label: 'App Store (RU)', url: 'https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973', Icon: StoreIcon },
      { label: 'App Store (Global)', url: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215', Icon: StoreIcon },
      { label: 'Скачать DMG', url: '/download/macos', external: true, Icon: FileIcon },
    ],
    linux: [
      { label: 'DEB (Ubuntu)', url: '/download/linux?format=deb', external: true, Icon: FileIcon },
      { label: 'RPM (Fedora)', url: '/download/linux?format=rpm', external: true, Icon: FileIcon },
      { label: 'PKG (Arch)', url: '/download/linux?format=pkg', external: true, Icon: FileIcon },
    ],
  },
  tv: {
    android_tv: [
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.happproxy', Icon: StoreIcon },
      { label: 'Скачать APK', url: '/download/android', external: true, Icon: FileIcon },
    ],
    apple_tv: [{ label: 'App Store', url: 'https://apps.apple.com/us/app/happ-proxy-utility-for-tv/id6748297274', Icon: StoreIcon }],
  },
}

const DEVICES = [
  { key: 'phone', label: 'Телефон', Icon: PhoneIcon },
  { key: 'computer', label: 'Компьютер', Icon: LaptopIcon },
  { key: 'tv', label: 'ТВ', Icon: TvIcon },
]

const PLATFORM_MAP = {
  iphone: { label: 'iPhone', Icon: AppleIcon },
  android: { label: 'Android', Icon: AndroidIcon },
  windows: { label: 'Windows', Icon: WindowsIcon },
  macos: { label: 'macOS', Icon: AppleIcon },
  linux: { label: 'Linux', Icon: LinuxIcon },
  android_tv: { label: 'Android TV', Icon: AndroidIcon },
  apple_tv: { label: 'Apple TV', Icon: AppleIcon },
}

function isTg() { return !!window.Telegram?.WebApp?.initData }
function extLink(url, ext) {
  const full = ext ? window.location.origin + url : url
  isTg() ? window.Telegram.WebApp.openLink(full) : window.open(full, '_blank')
}

export default function ConnectModal({ isOpen, onClose, subscriptionUrl }) {
  const [step, setStep] = useState('choice')
  const [device, setDevice] = useState(null)
  const [platform, setPlatform] = useState(null)

  function reset() { setStep('choice'); setDevice(null); setPlatform(null) }
  function close() { reset(); onClose() }
  function connect() {
    const url = `happ://add/${subscriptionUrl}`
    isTg() ? window.Telegram.WebApp.openLink(url) : (window.location.href = url)
    setTimeout(() => window.open(`/connect?url=${encodeURIComponent(subscriptionUrl)}`, '_blank'), 1500)
  }

  if (!isOpen) return null

  const slide = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.2 } }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" onClick={close} />

      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        className="fixed inset-x-0 bottom-0 z-[101] max-h-[80vh] overflow-y-auto rounded-t-[28px] border-t border-accent/10 bg-[oklch(0.11_0.015_192/97%)] px-5 pt-4 pb-6 backdrop-blur-2xl md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-sm md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[28px] md:border md:border-accent/8"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto mb-3 h-1 w-8 rounded-full bg-accent/20 md:hidden" />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-foreground">
            {step === 'choice' && 'Подключение VPN'}
            {step === 'device' && 'Устройство'}
            {step === 'platform' && 'Платформа'}
            {step === 'links' && PLATFORM_MAP[platform]?.label}
            {step === 'connect' && 'Подключиться'}
          </h2>
          <button onClick={close} className="flex h-7 w-7 items-center justify-center rounded-full text-muted/60 transition-colors hover:text-foreground">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 'choice' && (
            <motion.div key="c" {...slide} className="space-y-2.5">
              <p className="text-[13px] text-muted">Для подключения нужно приложение HAPP.</p>
              <button onClick={() => setStep('device')}
                className="flex w-full items-center gap-3.5 rounded-2xl border border-accent/12 bg-accent/[0.05] p-3.5 text-left transition-all active:scale-[0.98]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10"><DownloadIcon /></div>
                <div><p className="text-sm font-semibold text-foreground">Установить HAPP</p><p className="text-[11px] text-muted">Скачать для вашего устройства</p></div>
              </button>
              <button onClick={() => setStep('connect')}
                className="flex w-full items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-left transition-all active:scale-[0.98]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]"><CheckIcon /></div>
                <div><p className="text-sm font-semibold text-foreground">У меня есть HAPP</p><p className="text-[11px] text-muted">Добавить подписку</p></div>
              </button>
            </motion.div>
          )}

          {step === 'device' && (
            <motion.div key="d" {...slide} className="space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                {DEVICES.map((d) => (
                  <button key={d.key} onClick={() => { setDevice(d.key); setStep('platform') }}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all active:scale-[0.97] hover:border-accent/15 hover:bg-accent/[0.04]">
                    <d.Icon /><span className="text-[11px] font-medium text-foreground">{d.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={reset} className="flex items-center gap-1 text-[12px] text-muted hover:text-foreground"><BackIcon /> Назад</button>
            </motion.div>
          )}

          {step === 'platform' && device && (
            <motion.div key="p" {...slide} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {Object.keys(HAPP_LINKS[device] || {}).map((p) => {
                  const pm = PLATFORM_MAP[p]
                  return (
                    <button key={p} onClick={() => { setPlatform(p); setStep('links') }}
                      className="flex items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition-all active:scale-[0.97] hover:border-accent/15 hover:bg-accent/[0.04]">
                      <pm.Icon /><span className="text-[13px] font-medium text-foreground">{pm.label}</span>
                    </button>
                  )
                })}
              </div>
              <button onClick={() => { setDevice(null); setStep('device') }} className="flex items-center gap-1 text-[12px] text-muted hover:text-foreground"><BackIcon /> Назад</button>
            </motion.div>
          )}

          {step === 'links' && platform && (
            <motion.div key="l" {...slide} className="space-y-2.5">
              {(HAPP_LINKS[device]?.[platform] || []).map((link, i) => (
                <button key={i} onClick={() => extLink(link.url, link.external)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-left transition-all active:scale-[0.98] hover:border-accent/15">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]"><link.Icon /></div>
                  <span className="text-[13px] font-medium text-foreground">{link.label}</span>
                </button>
              ))}
              <div className="flex items-center justify-between pt-1">
                <button onClick={() => { setPlatform(null); setStep('platform') }} className="flex items-center gap-1 text-[12px] text-muted hover:text-foreground"><BackIcon /> Назад</button>
                <Button size="sm" className="text-[12px] font-semibold" onPress={() => setStep('connect')}>Далее →</Button>
              </div>
            </motion.div>
          )}

          {step === 'connect' && (
            <motion.div key="cn" {...slide} className="space-y-3">
              <p className="text-[13px] text-muted">Добавить подписку в HAPP:</p>
              <Button fullWidth size="lg" className="glow-cyan h-12 gap-2 text-[14px] font-bold" onPress={connect}>
                <RocketIcon /> Подключиться
              </Button>
              <div className="rounded-xl border border-white/[0.05] bg-black/15 p-3">
                <code className="block truncate text-[11px] text-accent/80">{subscriptionUrl}</code>
              </div>
              <button onClick={() => setStep('device')} className="flex items-center gap-1 text-[12px] text-muted hover:text-foreground"><BackIcon /> Скачать HAPP</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
