import { useEffect, useState, useRef } from 'react'
import { WebAppProvider, useInitData, useWebApp } from '@vkruglikov/react-telegram-web-app'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { telegramWebAppAuth } from '../api/telegram'
import { linkTelegram } from '../api/auth'
import { applyPendingPromo } from '../api/subscriptions'
import { Spinner } from '@heroui/react'

function TelegramAppInner() {
  const [initDataUnsafe, initData] = useInitData()
  const webApp = useWebApp()
  const navigate = useNavigate()
  const { loginWithData, fetchMe } = useAuthStore()
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

    // Parse deep link
    const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param || ''
    const isLinkRequest = startParam.startsWith('link_')
    const promoCode = startParam.startsWith('promo_') ? startParam.slice(6) : ''

    async function goNext() {
      if (promoCode) {
        try { await applyPendingPromo(promoCode) } catch {}
        localStorage.setItem('eifavpn_promo', promoCode)
        navigate(`/cabinet/purchase?promo=${promoCode}`, { replace: true })
      } else {
        navigate('/cabinet/overview', { replace: true })
      }
    }

    async function doAuth(rawInitData) {
      try {
        const result = await telegramWebAppAuth(rawInitData)
        if (result.tokens && result.user) {
          loginWithData(result.user, result.tokens)
          await goNext()
        } else {
          setError('Не удалось авторизоваться')
        }
      } catch (err) {
        setError(err.message || 'Ошибка авторизации')
      }
    }

    async function getInitData() {
      // Try immediately
      const raw = initData || window.Telegram?.WebApp?.initData
      if (raw) return raw
      // Poll every 100ms for up to 5s (SDK loads async)
      return new Promise((resolve) => {
        const start = Date.now()
        const iv = setInterval(() => {
          const d = window.Telegram?.WebApp?.initData
          if (d) { clearInterval(iv); resolve(d) }
          else if (Date.now() - start > 5000) { clearInterval(iv); resolve(null) }
        }, 100)
      })
    }

    async function auth() {
      // Step 1: Already have tokens?
      if (localStorage.getItem('eifavpn_access')) {
        const ok = await fetchMe()
        if (ok) {
          if (isLinkRequest) {
            try {
              const d = await getInitData()
              if (d) await linkTelegram(d)
            } catch {}
          }
          await goNext()
          return
        }
      }

      // Step 2: Auth with initData
      const rawInitData = await getInitData()
      if (!rawInitData) {
        navigate('/cabinet/login', { replace: true })
        return
      }
      await doAuth(rawInitData)
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
