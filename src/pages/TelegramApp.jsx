import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { telegramWebAppAuth } from '../api/telegram'
import { linkTelegram } from '../api/auth'
import { applyPendingPromo } from '../api/subscriptions'
import { Spinner } from '@heroui/react'

function waitForTelegramWebApp(timeout = 5000) {
  return new Promise((resolve) => {
    const tg = window.Telegram?.WebApp
    if (tg?.initData) { resolve(tg); return }
    const start = Date.now()
    const iv = setInterval(() => {
      const tg = window.Telegram?.WebApp
      if (tg?.initData) { clearInterval(iv); resolve(tg) }
      else if (Date.now() - start > timeout) { clearInterval(iv); resolve(null) }
    }, 50)
  })
}

export default function TelegramApp() {
  const navigate = useNavigate()
  const { loginWithData, fetchMe } = useAuthStore()
  const [error, setError] = useState(null)
  const authStarted = useRef(false)

  useEffect(() => {
    if (authStarted.current) return
    authStarted.current = true

    async function run() {
      // Wait for Telegram SDK (loaded async in index.html)
      const tg = await waitForTelegramWebApp()

      // Expand + ready
      if (tg) {
        try { tg.expand() } catch {}
        try { tg.ready() } catch {}
      }

      // Parse deep link params
      const startParam = tg?.initDataUnsafe?.start_param || ''
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

      // Step 1: Already have tokens?
      if (localStorage.getItem('eifavpn_access')) {
        const ok = await fetchMe()
        if (ok) {
          if (isLinkRequest && tg?.initData) {
            try { await linkTelegram(tg.initData) } catch {}
          }
          await goNext()
          return
        }
      }

      // Step 2: Authenticate with initData
      const initData = tg?.initData
      if (!initData) {
        navigate('/cabinet/login', { replace: true })
        return
      }

      try {
        const result = await telegramWebAppAuth(initData)
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

    run()
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
