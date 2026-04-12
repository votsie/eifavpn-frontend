import { useEffect, useRef } from 'react'

const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'EIFA_VPNbot'

export default function TelegramWidget() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous widget
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', BOT_USERNAME)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '12')
    script.setAttribute('data-auth-url', `${window.location.origin}/api/auth/telegram`)
    script.setAttribute('data-request-access', 'write')
    script.async = true

    containerRef.current.appendChild(script)
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex min-h-[44px] items-center justify-center [&>iframe]:!w-full"
    />
  )
}
