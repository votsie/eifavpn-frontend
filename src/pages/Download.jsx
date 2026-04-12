import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@heroui/react'
import Background from '../components/Background'

const GITHUB_URLS = {
  android: 'https://github.com/Happ-proxy/happ-android/releases/latest/download/Happ.apk',
  windows: 'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/setup-Happ.x64.exe',
  macos: 'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.macOS.universal.dmg',
  'linux-deb': 'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.x64.deb',
  'linux-rpm': 'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.x64.rpm',
  'linux-pkg': 'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.x64.pkg.tar.zst',
}

const PLATFORM_NAMES = {
  android: 'Android',
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
}

export default function Download() {
  const { platform } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)

  const format = searchParams.get('format')
  const urlKey = platform === 'linux' && format ? `linux-${format}` : platform
  const downloadUrl = GITHUB_URLS[urlKey]
  const platformName = PLATFORM_NAMES[platform] || platform

  useEffect(() => {
    if (downloadUrl && !started) {
      setStarted(true)
      const timer = setTimeout(() => {
        window.location.href = downloadUrl
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [downloadUrl, started])

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <Background />
      <div className="relative z-10 mx-auto max-w-md w-full px-4">
        <div className="glass-card rounded-2xl border border-white/[0.06] bg-surface/40 p-8 text-center">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold text-accent">EIFAVPN</h1>
            <p className="mt-1 text-sm text-muted">Быстрый и безопасный VPN</p>
          </div>

          <div className="mb-6">
            <p className="text-lg font-semibold text-foreground">
              Скачать HAPP для {platformName}
            </p>
            {format && (
              <p className="mt-1 text-sm text-muted">Формат: {format.toUpperCase()}</p>
            )}
          </div>

          {downloadUrl ? (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted">
                  Скачивание должно начаться автоматически...
                </p>
              </div>

              <Button
                size="lg"
                className="glow-cyan w-full font-semibold"
                onPress={() => { window.location.href = downloadUrl }}
              >
                Если скачивание не началось — нажмите здесь
              </Button>
            </>
          ) : (
            <div className="mb-4">
              <p className="text-sm text-danger">
                Неизвестная платформа: {platform}
              </p>
            </div>
          )}

          <Button
            size="sm"
            variant="light"
            className="mt-4 text-muted"
            onPress={() => navigate('/cabinet/overview')}
          >
            Вернуться в кабинет
          </Button>
        </div>
      </div>
    </div>
  )
}
