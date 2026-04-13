import { useEffect, useRef, useState, useCallback } from 'react'

const TELEGRAM_LOGIN_JS = 'https://oauth.telegram.org/js/telegram-login.js?3'
const TELEGRAM_CLIENT_ID = '8631762754'

/**
 * Hook that loads telegram-login.js and provides openTelegramLogin().
 * Returns { openTelegramLogin, sdkReady, loading, error }.
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

  const openTelegramLogin = useCallback(() => {
    if (!window.Telegram?.Login) {
      setError('Telegram SDK не загружен')
      return
    }
    setLoading(true)
    setError(null)

    window.Telegram.Login.auth(
      { client_id: TELEGRAM_CLIENT_ID, request_access: ['write'] },
      (data) => {
        setLoading(false)
        if (!data) return
        if (data.error) {
          setError(data.error)
          return
        }
        if (data.id_token) {
          callbackRef.current?.({ id_token: data.id_token, user: data.user })
        }
      }
    )
  }, [])

  return { openTelegramLogin, sdkReady, loading, error }
}
