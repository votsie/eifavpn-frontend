import { useState } from 'react'
import { Modal, ModalBackdrop, ModalContainer, ModalDialog, ModalHeader, ModalHeading, ModalBody, Button } from '@heroui/react'
import { motion, AnimatePresence } from 'motion/react'

const HAPP_LINKS = {
  phone: {
    iphone: [
      { label: 'App Store (RU)', url: 'https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973' },
      { label: 'App Store (Global)', url: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215' },
    ],
    android: [
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.happproxy' },
      { label: 'Скачать APK', url: '/download/android', external: true },
    ],
  },
  computer: {
    windows: [
      { label: 'Скачать EXE', url: '/download/windows', external: true },
    ],
    macos: [
      { label: 'App Store (RU)', url: 'https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973' },
      { label: 'App Store (Global)', url: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215' },
      { label: 'Скачать DMG', url: '/download/macos', external: true },
    ],
    linux: [
      { label: 'Скачать DEB', url: '/download/linux?format=deb', external: true },
      { label: 'Скачать RPM', url: '/download/linux?format=rpm', external: true },
      { label: 'Скачать PKG', url: '/download/linux?format=pkg', external: true },
    ],
  },
  tv: {
    android_tv: [
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.happproxy' },
      { label: 'Скачать APK', url: '/download/android', external: true },
    ],
    apple_tv: [
      { label: 'App Store', url: 'https://apps.apple.com/us/app/happ-proxy-utility-for-tv/id6748297274' },
    ],
  },
}

const DEVICE_CATEGORIES = [
  { key: 'phone', label: 'Телефон', icon: '\u{1F4F1}' },
  { key: 'computer', label: 'Компьютер', icon: '\u{1F4BB}' },
  { key: 'tv', label: 'ТВ', icon: '\u{1F4FA}' },
]

const PLATFORM_LABELS = {
  iphone: 'iPhone',
  android: 'Android',
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  android_tv: 'Android TV',
  apple_tv: 'Apple TV',
}

function isTelegramWebApp() {
  return !!window.Telegram?.WebApp?.initData
}

function openExternalLink(url) {
  if (isTelegramWebApp()) {
    window.Telegram.WebApp.openLink(url)
  } else {
    window.open(url, '_blank')
  }
}

export default function ConnectModal({ isOpen, onClose, subscriptionUrl }) {
  const [step, setStep] = useState(0) // 0 = choice, 1 = install (pick device), 2 = connect
  const [deviceCategory, setDeviceCategory] = useState(null)
  const [platform, setPlatform] = useState(null)

  function reset() {
    setStep(0)
    setDeviceCategory(null)
    setPlatform(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleHaveApp() {
    setStep(2)
  }

  function handleInstall() {
    setStep(1)
  }

  function handleConnect() {
    const connectUrl = `happ://add/${subscriptionUrl}`
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.openLink(connectUrl)
    } else {
      window.open(connectUrl, '_blank')
    }
  }

  function handleLinkClick(link) {
    if (link.external) {
      openExternalLink(window.location.origin + link.url)
    } else {
      openExternalLink(link.url)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <ModalBackdrop />
      <ModalContainer className="flex items-center justify-center">
        <ModalDialog className="bg-surface border border-white/[0.06] rounded-2xl max-w-lg w-full mx-4">
          <ModalHeader className="border-b border-white/[0.06] p-4">
            <ModalHeading className="text-foreground font-semibold">Подключение VPN</ModalHeading>
          </ModalHeader>
          <ModalBody className="p-4 pb-6">
            <AnimatePresence mode="wait">
              {/* Step 0: Choice */}
              {step === 0 && (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-muted">
                    Для подключения VPN необходимо приложение HAPP.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      size="lg"
                      className="glow-cyan h-auto flex-col gap-2 py-6 font-semibold"
                      onPress={handleInstall}
                    >
                      <span className="text-2xl">{'\u{2B07}\u{FE0F}'}</span>
                      <span>Установить HAPP</span>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-auto flex-col gap-2 py-6"
                      onPress={handleHaveApp}
                    >
                      <span className="text-2xl">{'\u{2705}'}</span>
                      <span>У меня есть HAPP</span>
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Install — device type selector */}
              {step === 1 && !deviceCategory && (
                <motion.div
                  key="device-type"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-muted">Выберите тип устройства:</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {DEVICE_CATEGORIES.map((cat) => (
                      <Button
                        key={cat.key}
                        size="lg"
                        variant="outline"
                        className="h-auto flex-col gap-2 py-6"
                        onPress={() => setDeviceCategory(cat.key)}
                      >
                        <span className="text-3xl">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </Button>
                    ))}
                  </div>
                  <Button size="sm" variant="light" className="text-muted" onPress={reset}>
                    Назад
                  </Button>
                </motion.div>
              )}

              {/* Step 1b: Install — platform selector */}
              {step === 1 && deviceCategory && !platform && (
                <motion.div
                  key="platform"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-muted">Выберите платформу:</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.keys(HAPP_LINKS[deviceCategory] || {}).map((plat) => (
                      <Button
                        key={plat}
                        size="lg"
                        variant="outline"
                        className="h-auto py-4"
                        onPress={() => setPlatform(plat)}
                      >
                        {PLATFORM_LABELS[plat] || plat}
                      </Button>
                    ))}
                  </div>
                  <Button size="sm" variant="light" className="text-muted" onPress={() => setDeviceCategory(null)}>
                    Назад
                  </Button>
                </motion.div>
              )}

              {/* Step 1c: Install — download links */}
              {step === 1 && deviceCategory && platform && (
                <motion.div
                  key="download"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-muted">
                    Скачайте HAPP для {PLATFORM_LABELS[platform] || platform}:
                  </p>
                  <div className="space-y-2">
                    {(HAPP_LINKS[deviceCategory]?.[platform] || []).map((link, i) => (
                      <Button
                        key={i}
                        size="lg"
                        variant="outline"
                        className="w-full justify-start"
                        onPress={() => handleLinkClick(link)}
                      >
                        {link.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="light" className="text-muted" onPress={() => setPlatform(null)}>
                      Назад
                    </Button>
                    <Button size="sm" className="glow-cyan font-semibold" onPress={handleHaveApp}>
                      Уже установил — Подключиться
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Connect */}
              {step === 2 && (
                <motion.div
                  key="connect"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-muted">
                    Нажмите кнопку ниже, чтобы открыть HAPP и автоматически добавить подписку.
                  </p>
                  <Button
                    size="lg"
                    className="glow-cyan w-full font-semibold"
                    onPress={handleConnect}
                  >
                    Подключиться в HAPP
                  </Button>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onPress={() => {
                        navigator.clipboard.writeText(subscriptionUrl)
                      }}
                    >
                      Копировать ссылку подписки
                    </Button>
                  </div>
                  <Button size="sm" variant="light" className="text-muted" onPress={reset}>
                    Назад
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </ModalBody>
        </ModalDialog>
      </ModalContainer>
    </Modal>
  )
}
