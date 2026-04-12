import { useEffect, useRef } from 'react'

export default function TelegramWidget() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', 'EIFA_VPNbot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '14')
    script.setAttribute('data-auth-url', `${window.location.origin}/api/auth/telegram/callback/`)
    script.setAttribute('data-request-access', 'write')
    script.async = true

    containerRef.current.appendChild(script)
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] py-2 transition-colors hover:bg-white/[0.04]"
      style={{ minHeight: '48px' }}
    />
  )
}
