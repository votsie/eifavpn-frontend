import { useState, useEffect } from 'react'
import { Button, Chip, Tabs, Tab } from '@heroui/react'
import { Copy } from '@gravity-ui/icons'
import { motion } from 'motion/react'
import { useAuthStore } from '../../stores/authStore'
import { getMySubscription } from '../../api/subscriptions'

const PLATFORMS = [
  {
    id: 'ios',
    label: 'iOS',
    icon: '\uF8FF',
    app: 'Streisand',
    appUrl: 'https://apps.apple.com/app/streisand/id6450534064',
    steps: [
      'Скачайте приложение Streisand из App Store.',
      'Откройте приложение и нажмите "+" в правом верхнем углу.',
      'Выберите "Добавить из буфера обмена" или "Добавить подписку по URL".',
      'Скопируйте URL подписки (кнопка ниже) и вставьте его.',
      'Нажмите "Сохранить". Список серверов загрузится автоматически.',
      'Выберите сервер и нажмите кнопку подключения.',
    ],
  },
  {
    id: 'android',
    label: 'Android',
    icon: '\uD83E\uDD16',
    app: 'Hiddify',
    appUrl: 'https://play.google.com/store/apps/details?id=app.hiddify.com',
    steps: [
      'Скачайте приложение Hiddify из Google Play.',
      'Откройте приложение и нажмите "Новый профиль".',
      'Выберите "Добавить из ссылки" или "Добавить из буфера обмена".',
      'Скопируйте URL подписки (кнопка ниже) и вставьте его.',
      'Нажмите "Добавить". Профиль с серверами появится в списке.',
      'Нажмите на кнопку подключения (большая круглая кнопка).',
    ],
  },
  {
    id: 'windows',
    label: 'Windows',
    icon: '\uD83D\uDDA5\uFE0F',
    app: 'Hiddify',
    appUrl: 'https://github.com/hiddify/hiddify-app/releases/latest',
    steps: [
      'Скачайте Hiddify с GitHub (ссылка выше). Выберите файл .exe для Windows.',
      'Установите и запустите приложение.',
      'Нажмите "Новый профиль" и выберите "Добавить из ссылки".',
      'Скопируйте URL подписки и вставьте его в поле.',
      'Нажмите "Добавить". Серверы загрузятся автоматически.',
      'Выберите сервер и нажмите "Подключить".',
    ],
  },
  {
    id: 'macos',
    label: 'macOS',
    icon: '\uD83C\uDF4E',
    app: 'Streisand',
    appUrl: 'https://apps.apple.com/app/streisand/id6450534064',
    steps: [
      'Скачайте Streisand из Mac App Store.',
      'Откройте приложение и перейдите в настройки подписок.',
      'Нажмите "+" и выберите "Добавить подписку по URL".',
      'Скопируйте URL подписки и вставьте его.',
      'Серверы загрузятся автоматически.',
      'Выберите сервер и включите VPN через переключатель.',
    ],
  },
  {
    id: 'linux',
    label: 'Linux',
    icon: '\uD83D\uDC27',
    app: 'Hiddify',
    appUrl: 'https://github.com/hiddify/hiddify-app/releases/latest',
    steps: [
      'Скачайте Hiddify с GitHub. Выберите .AppImage или .deb файл.',
      'Для AppImage: chmod +x Hiddify.AppImage && ./Hiddify.AppImage',
      'Для DEB: sudo dpkg -i hiddify.deb',
      'Запустите приложение и нажмите "Новый профиль".',
      'Вставьте URL подписки и нажмите "Добавить".',
      'Выберите сервер и подключитесь.',
    ],
  },
]

function QrCode({ url }) {
  if (!url) return null
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=0a0f14&color=5cebd6&data=${encodeURIComponent(url)}`

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="overflow-hidden rounded-xl border border-border bg-white p-2">
        <img
          src={qrUrl}
          alt="QR код подписки"
          width={180}
          height={180}
          className="block"
        />
      </div>
      <p className="text-[11px] text-muted">Отсканируйте камерой телефона</p>
    </div>
  )
}

export default function Guide() {
  const { user } = useAuthStore()
  const [subUrl, setSubUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('ios')

  useEffect(() => {
    if (user?.subscription_url) {
      setSubUrl(user.subscription_url)
    }
    // Also try to get from subscription
    getMySubscription()
      .then((data) => {
        if (data?.subscription?.subscription_url) {
          setSubUrl(data.subscription.subscription_url)
        }
      })
      .catch(() => {})
  }, [user])

  function handleCopy() {
    if (!subUrl) return
    navigator.clipboard.writeText(subUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const platform = PLATFORMS.find((p) => p.id === selectedPlatform) || PLATFORMS[0]

  return (
    <div className="mx-auto max-w-3xl w-full space-y-3 overflow-hidden md:space-y-5">
      <h1 className="font-heading text-2xl font-bold text-foreground">Инструкция</h1>
      <p className="text-sm text-muted">Как подключиться к EIFAVPN на вашем устройстве</p>

      {/* Subscription URL */}
      {subUrl && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="theme-card-accent rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/[0.08] to-surface/60 p-4 md:p-5"
        >
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
            Ваш URL подписки
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg theme-code-bg px-3 py-2 font-mono text-xs text-accent">
              {subUrl}
            </code>
            <Button
              size="sm"
              variant={copied ? undefined : 'outline'}
              className={copied ? 'bg-accent text-accent-foreground' : ''}
              onPress={handleCopy}
              startContent={<Copy className="h-3.5 w-3.5" />}
            >
              {copied ? 'Скопировано!' : 'Копировать'}
            </Button>
          </div>
        </motion.div>
      )}

      {!subUrl && (
        <div className="rounded-2xl border border-warning/20 bg-warning/[0.06] p-5">
          <p className="text-sm text-warning">
            У вас нет активной подписки. Оформите подписку, чтобы получить URL для подключения.
          </p>
        </div>
      )}

      {/* Platform tabs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs
          selectedKey={selectedPlatform}
          onSelectionChange={setSelectedPlatform}
          classNames={{
            tabList: 'bg-surface/40 border border-border',
            cursor: 'bg-accent/20',
            tab: 'text-muted data-[selected=true]:text-accent',
          }}
        >
          {PLATFORMS.map((p) => (
            <Tab key={p.id} title={`${p.icon} ${p.label}`} />
          ))}
        </Tabs>
      </motion.div>

      {/* Platform content */}
      <motion.div
        key={selectedPlatform}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="theme-card rounded-2xl border border-border bg-surface/40 p-4 md:p-5"
      >
        {/* App info */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Рекомендуемое приложение
            </p>
            <p className="mt-0.5 text-lg font-bold text-accent">{platform.app}</p>
          </div>
          <Button
            size="sm"
            className="glow-cyan font-semibold"
            as="a"
            href={platform.appUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Скачать
          </Button>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {platform.steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                {i + 1}
              </div>
              <p className="pt-0.5 text-[13px] leading-relaxed text-foreground/80">{step}</p>
            </div>
          ))}
        </div>

        {/* Copy URL button inline */}
        {subUrl && (
          <div className="mt-5 border-t border-border pt-4">
            <Button
              size="sm"
              variant="outline"
              onPress={handleCopy}
              startContent={<Copy className="h-3.5 w-3.5" />}
            >
              {copied ? 'Скопировано!' : 'Копировать URL подписки'}
            </Button>
          </div>
        )}
      </motion.div>

      {/* QR Code for mobile */}
      {subUrl && (selectedPlatform === 'ios' || selectedPlatform === 'android') && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="theme-card rounded-2xl border border-border bg-surface/40 p-4 md:p-5"
        >
          <p className="mb-4 text-center text-sm font-semibold text-foreground">
            Или отсканируйте QR-код
          </p>
          <QrCode url={subUrl} />
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="theme-card-accent rounded-2xl border border-accent/10 bg-accent/[0.04] p-4 md:p-5"
      >
        <p className="mb-2 text-sm font-semibold text-foreground">Полезные советы</p>
        <div className="space-y-2 text-[13px] text-muted">
          <p>
            <Chip size="sm" className="mr-2 bg-accent/12 text-[10px] text-accent">Совет</Chip>
            Если серверы не загружаются, попробуйте обновить подписку в приложении.
          </p>
          <p>
            <Chip size="sm" className="mr-2 bg-accent/12 text-[10px] text-accent">Совет</Chip>
            Выбирайте ближайший сервер для лучшей скорости соединения.
          </p>
          <p>
            <Chip size="sm" className="mr-2 bg-accent/12 text-[10px] text-accent">Совет</Chip>
            Подписка обновляется автоматически. Новые серверы появятся при обновлении.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
