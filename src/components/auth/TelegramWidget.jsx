import { useEffect, useRef, useCallback } from 'react'
import { Button } from '@heroui/react'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate } from 'react-router-dom'

const TG_CLIENT_ID = '8631762754'

export default function TelegramWidget() {
  const sdkLoaded = useRef(false)
  const { loginByShortUuid } = useAuthStore()
  const navigate = useNavigate()

  // Load Telegram Login SDK once
  useEffect(() => {
    if (sdkLoaded.current || document.querySelector('script[src*="telegram-login.js"]')) return
    sdkLoaded.current = true

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-login.js'
    script.async = true
    script.onload = () => {
      if (window.Telegram?.Login) {
        window.Telegram.Login.init({ client_id: TG_CLIENT_ID, request_access: ['write'] })
      }
    }
    document.head.appendChild(script)
  }, [])

  const handleClick = useCallback(() => {
    if (!window.Telegram?.Login) return

    window.Telegram.Login.auth(
      { client_id: TG_CLIENT_ID, request_access: ['write'] },
      async (result) => {
        if (result.error) return
        if (result.id_token) {
          // Send id_token to our backend for verification + Remnawave lookup
          try {
            const resp = await fetch('/api/auth/telegram/callback/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id_token: result.id_token }),
            })
            const data = await resp.json()
            if (data.shortUuid) {
              const success = await loginByShortUuid(data.shortUuid)
              if (success) navigate('/cabinet/overview', { replace: true })
            }
          } catch {
            // fallback: ignore
          }
        }
      }
    )
  }, [loginByShortUuid, navigate])

  return (
    <Button
      fullWidth
      size="lg"
      variant="outline"
      className="h-12 text-[14px] font-medium"
      onPress={handleClick}
    >
      <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" fill="#29B6F6"/>
      </svg>
      Войти через Telegram
    </Button>
  )
}
