import { useEffect, useRef, useCallback } from 'react'

export default function TelegramLoginWidget({ botUsername, onAuth }) {
  const containerRef = useRef(null)
  const callbackRef = useRef(onAuth)
  callbackRef.current = onAuth

  const stableCallback = useCallback((user) => {
    callbackRef.current?.(user)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    window.__telegramLoginCallback = stableCallback

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botUsername)
    script.setAttribute('data-size', 'medium')
    script.setAttribute('data-radius', '8')
    script.setAttribute('data-onauth', '__telegramLoginCallback(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(script)

    return () => {
      delete window.__telegramLoginCallback
    }
  }, [botUsername, stableCallback])

  return <div ref={containerRef} />
}
