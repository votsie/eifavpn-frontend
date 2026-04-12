import { useEffect, useState } from 'react'
import { WebAppProvider, useInitData, useWebApp } from '@vkruglikov/react-telegram-web-app'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { telegramWebAppAuth } from '../api/telegram'
import { Spinner } from '@heroui/react'

function TelegramAppInner() {
  const [initDataUnsafe, initData] = useInitData()
  const webApp = useWebApp()
  const navigate = useNavigate()
  const { loginWithData, isAuthenticated } = useAuthStore()
  const [error, setError] = useState(null)
  const [authenticating, setAuthenticating] = useState(false)

  useEffect(() => {
    // Expand the mini app to full height
    if (webApp?.expand) {
      webApp.expand()
    }
  }, [webApp])

  useEffect(() => {
    // Already authenticated — go straight to cabinet
    if (isAuthenticated) {
      navigate('/cabinet/overview', { replace: true })
      return
    }

    // No initData — not running in Telegram
    if (!initData) {
      // Wait a bit for Telegram SDK to initialize
      const timer = setTimeout(() => {
        if (!window.Telegram?.WebApp?.initData) {
          // Not in Telegram — redirect to normal login
          navigate('/cabinet/login', { replace: true })
        }
      }, 2000)
      return () => clearTimeout(timer)
    }

    // Have initData — authenticate
    if (initData && !authenticating) {
      setAuthenticating(true)
      telegramWebAppAuth(initData)
        .then((data) => {
          if (data.tokens && data.user) {
            loginWithData(data.user, data.tokens)
            // Signal to Telegram that we're ready
            if (webApp?.ready) webApp.ready()
            navigate('/cabinet/overview', { replace: true })
          } else {
            setError('Не удалось авторизоваться')
          }
        })
        .catch((err) => {
          setError(err.message || 'Ошибка авторизации')
        })
    }
  }, [initData, isAuthenticated])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <img src="/logo.png" alt="EIFAVPN" className="h-14 w-14 object-contain" />
        <p className="text-sm text-danger">{error}</p>
        <button
          onClick={() => navigate('/cabinet/login', { replace: true })}
          className="text-sm text-accent underline"
        >
          Войти через браузер
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <img src="/logo.png" alt="EIFAVPN" className="h-14 w-14 object-contain" />
      <Spinner size="lg" color="current" className="text-accent" />
      <p className="text-sm text-muted">Вход через Telegram...</p>
    </div>
  )
}

export default function TelegramApp() {
  return (
    <WebAppProvider>
      <TelegramAppInner />
    </WebAppProvider>
  )
}
