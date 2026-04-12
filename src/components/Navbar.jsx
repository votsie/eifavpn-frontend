import { useRef, useState, useEffect } from 'react'
import { Button } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import LiquidGlass from 'liquid-glass-react'

function NavContent() {
  const navigate = useNavigate()

  return (
    <nav className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 backdrop-blur-xl md:gap-8 md:px-6 md:py-3">
      <a href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
        <img src="/logo.png" alt="EIFAVPN" className="h-8 w-8 object-contain" />
        <span className="font-heading text-[17px] font-bold tracking-tight text-foreground">
          EIFAVPN
        </span>
      </a>

      <div className="hidden items-center gap-7 md:flex">
        <a href="#features" className="text-[13px] font-medium text-muted/80 transition-colors hover:text-foreground">
          Возможности
        </a>
        <a href="#plans" className="text-[13px] font-medium text-muted/80 transition-colors hover:text-foreground">
          Тарифы
        </a>
        <a href="#faq" className="text-[13px] font-medium text-muted/80 transition-colors hover:text-foreground">
          Поддержка
        </a>
      </div>

      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          className="hidden text-[13px] font-medium md:flex"
          onPress={() => navigate('/cabinet/login')}
        >
          Войти
        </Button>
        <Button
          size="sm"
          className="text-[13px] font-semibold"
          onPress={() => navigate('/register')}
        >
          Начать
        </Button>
      </div>
    </nav>
  )
}

export default function Navbar() {
  const containerRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <header ref={containerRef} className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:px-6 md:pt-4">
      <div className="mx-auto max-w-5xl">
        {isDesktop ? (
          <LiquidGlass
            cornerRadius={16}
            blurAmount={0.06}
            saturation={130}
            displacementScale={45}
            elasticity={0.15}
            aberrationIntensity={2}
            mouseContainer={containerRef}
          >
            <NavContent />
          </LiquidGlass>
        ) : (
          <NavContent />
        )}
      </div>
    </header>
  )
}
