import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@heroui/react'
import Background from '../components/Background'

export default function ConnectPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showFallback, setShowFallback] = useState(false)
  const [copied, setCopied] = useState(false)

  const subscriptionUrl = searchParams.get('url') || ''
  const isValidUrl = subscriptionUrl.startsWith('https://')
  const hiddifyUrl = isValidUrl ? `hiddify://import/${subscriptionUrl}` : ''

  useEffect(() => {
    if (isValidUrl) {
      window.location.href = hiddifyUrl
      const timer = setTimeout(() => setShowFallback(true), 2000)
      return () => clearTimeout(timer)
    } else {
      setShowFallback(true)
    }
  }, [subscriptionUrl, hiddifyUrl])

  function handleRetry() {
    window.location.href = hiddifyUrl
  }

  function handleCopy() {
    navigator.clipboard.writeText(subscriptionUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <Background />
      <div className="relative z-10 mx-auto max-w-md w-full px-4">
        <div className="theme-card rounded-2xl border border-border bg-surface/40 p-8 text-center">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold text-accent">EIFAVPN</h1>
            <p className="mt-1 text-sm text-muted">Подключение к VPN</p>
          </div>

          {!isValidUrl ? (
            <p className="text-sm text-danger">Ссылка подписки не указана или некорректна</p>
          ) : !showFallback ? (
            <div>
              <p className="text-sm text-muted">Открываем Hiddify...</p>
              <div className="mt-4 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Если Hiddify не открылся автоматически, попробуйте ещё раз:
              </p>

              <Button
                size="lg"
                className="glow-cyan w-full font-semibold"
                onPress={handleRetry}
              >
                Открыть в Hiddify
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onPress={() => window.open('https://play.google.com/store/apps/details?id=app.hiddify.com', '_blank')}
              >
                Скачать Hiddify
              </Button>

              <Button
                size="sm"
                variant={copied ? undefined : 'outline'}
                className={`w-full ${copied ? 'bg-accent text-accent-foreground' : ''}`}
                onPress={handleCopy}
              >
                {copied ? 'Скопировано!' : 'Копировать ссылку'}
              </Button>
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
