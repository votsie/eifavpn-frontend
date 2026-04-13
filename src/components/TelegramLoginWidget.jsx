import { useEffect, useRef, useState } from 'react'
import { Button, Spinner } from '@heroui/react'

const TELEGRAM_LOGIN_JS = 'https://oauth.telegram.org/js/telegram-login.js?3'
const TELEGRAM_CLIENT_ID = 8631762754

/**
 * Telegram Login via OIDC (telegram-login.js).
 * Loads the new library and calls Telegram.Login.auth() on button click.
 * Returns { id_token, user } on success via onAuth callback.
 */
export default function TelegramLoginWidget({ onAuth }) {
  const callbackRef = useRef(onAuth)
  callbackRef.current = onAuth
  const [sdkReady, setSdkReady] = useState(!!window.Telegram?.Login)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load telegram-login.js once
  useEffect(() => {
    if (window.Telegram?.Login) {
      setSdkReady(true)
      return
    }
    const existing = document.querySelector(`script[src^="${TELEGRAM_LOGIN_JS}"]`)
    if (existing) {
      existing.addEventListener('load', () => setSdkReady(true))
      return
    }
    const script = document.createElement('script')
    script.src = TELEGRAM_LOGIN_JS
    script.async = true
    script.onload = () => setSdkReady(true)
    script.onerror = () => setError('Не удалось загрузить Telegram SDK')
    document.head.appendChild(script)
  }, [])

  function handleClick() {
    if (!window.Telegram?.Login) {
      setError('Telegram SDK не загружен')
      return
    }
    setLoading(true)
    setError(null)

    window.Telegram.Login.auth(
      { bot_id: TELEGRAM_CLIENT_ID, request_access: ['write'] },
      (data) => {
        setLoading(false)
        if (!data) {
          // User closed the popup
          return
        }
        if (data.error) {
          setError(data.error)
          return
        }
        if (data.id_token) {
          callbackRef.current?.({ id_token: data.id_token, user: data.user })
        }
      }
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        size="md"
        variant="outline"
        className="text-[14px] font-medium"
        onPress={handleClick}
        isDisabled={!sdkReady || loading}
        isPending={loading}
        startContent={
          !loading && (
            <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" fill="#29B6F6"/>
            </svg>
          )
        }
      >
        {!sdkReady ? <Spinner size="sm" /> : 'Войти через Telegram'}
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
