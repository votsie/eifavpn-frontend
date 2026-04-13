import { useEffect, useState, useRef } from 'react'
import { WebAppProvider, useInitData, useWebApp } from '@vkruglikov/react-telegram-web-app'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { telegramWebAppAuth } from '../api/telegram'
import { linkTelegram } from '../api/auth'
import { Spinner } from '@heroui/react'

function TelegramAppInner() {
  const [initDataUnsafe, initData] = useInitData()
  const webApp = useWebApp()
  const navigate = useNavigate()
  const { loginWithData, loginWithTokens, isAuthenticated, fetchMe } = useAuthStore()
  const [error, setError] = useState(null)
  const authStarted = useRef(false)

  // Expand mini app
  useEffect(() => {
    if (webApp?.expand) webApp.expand()
    if (webApp?.ready) webApp.ready()
  }, [webApp])

  useEffect(() => {
    if (authStarted.current) return
    authStarted.current = true

    async function auth() {
      // Check for deep link: startapp=link_{user_id}
      const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param || ''
      const isLinkRequest = startParam.startsWith('link_')

      // Step 1: Check if we already have valid tokens in localStorage
      const hasTokens = !!localStorage.getItem('eifavpn_access')
      if (hasTokens) {
        const ok = await fetchMe()
        if (ok) {
          // If this is a link request, try to link Telegram to the account
          if (isLinkRequest) {
            try {
              const tgInitData = initData || window.Telegram?.WebApp?.initData
              if (tgInitData) {
                await linkTelegram(tgInitData)
              }
            } catch {}
          }
          navigate('/cabinet/overview', { replace: true })
          return
        }
      }

      // Step 2: Authenticate via Telegram initData
      const rawInitData = initData || window.Telegram?.WebApp?.initData
      if (!rawInitData) {
        // Wait for SDK
        await new Promise(r => setTimeout(r, 1500))
        const retry = window.Telegram?.WebApp?.initData
        if (!retry) {
          navigate('/cabinet/login', { replace: true })
          return
        }
        await doTelegramAuth(retry)
      } else {
        await doTelegramAuth(rawInitData)
      }
    }

    async function doTelegramAuth(data) {
      try {
        const result = await telegramWebAppAuth(data)
        if (result.tokens && result.user) {
          loginWithData(result.user, result.tokens)
          navigate('/cabinet/overview', { replace: true })
        } else {
          setError('Не удалось авторизоваться')
        }
      } catch (err) {
        setError(err.message || 'Ошибка авторизации')
      }
    }

    auth()
  }, [])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <img src="/logo.png" alt="EIFAVPN" className="h-14 w-14 object-contain" />
        <p className="text-sm text-danger">{error}</p>
        <button
          onClick={() => { window.location.href = '/cabinet/login' }}
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
