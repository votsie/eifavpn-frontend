import { useEffect, useRef, useState, useCallback } from 'react'

const TELEGRAM_LOGIN_JS = 'https://telegram.org/js/telegram-widget.js?22'
const TELEGRAM_BOT_ID = '8549019404'

/**
 * Hook for Telegram Web Login Widget (hash-based, not OAuth 2.0).
 *
 * Returns widgetData: {id, first_name, last_name, username, photo_url, auth_date, hash}
 * Backend verifies the hash with bot token.
 */
export function useTelegramLogin(onAuth) {
  const callbackRef = useRef(onAuth)
  callbackRef.current = onAuth
  const [sdkReady, setSdkReady] = useState(!!window.Telegram?.Login)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (window.Telegram?.Login) {
      setSdkReady(true)
      return
    }
    const existing = document.querySelector(`script[src^="https://telegram.org/js/telegram-widget"]`)
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

  const openTelegramLogin = useCallback(() => {
    if (!window.Telegram?.Login) {
      setError('Telegram SDK не загружен')
      return
    }
    setLoading(true)
    setError(null)

    window.Telegram.Login.auth(
      { bot_id: TELEGRAM_BOT_ID, request_access: 'write' },
      (data) => {
        setLoading(false)
        if (!data) {
          setError('Вход отменён')
          return
        }
        // Web Login returns: {id, first_name, last_name, username, photo_url, auth_date, hash}
        if (data.id) {
          callbackRef.current?.({ widgetData: data })
        }
      }
    )
  }, [])

  return { openTelegramLogin, sdkReady, loading, error }
}
