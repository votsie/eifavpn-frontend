import { useRef, useState, useEffect } from 'react'
import { Button } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import LiquidGlass from 'liquid-glass-react'

function NavContent() {
  const navigate = useNavigate()
  return (
    <nav className="flex items-center justify-between rounded-[18px] border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 md:px-6 md:py-3">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="EIFAVPN" className="h-8 w-8 object-contain" />
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">
          EIFAVPN
        </span>
      </div>

      <div className="hidden items-center gap-8 md:flex">
        <a href="#features" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
          Возможности
        </a>
        <a href="#plans" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
          Тарифы
        </a>
        <a href="#" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
          Поддержка
        </a>
      </div>

      <Button size="sm" className="font-semibold" onPress={() => navigate('/cabinet')}>
        Личный кабинет
      </Button>
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
    <header
      ref={containerRef}
      className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 md:px-6 md:pt-4"
    >
      <div className="mx-auto max-w-5xl">
        {isDesktop ? (
          <LiquidGlass
            cornerRadius={18}
            blurAmount={0.07}
            saturation={135}
            displacementScale={50}
            elasticity={0.18}
            aberrationIntensity={3}
            mouseContainer={containerRef}
          >
            <NavContent />
          </LiquidGlass>
        ) : (
          <div className="backdrop-blur-xl">
            <NavContent />
          </div>
        )}
      </div>
    </header>
  )
}
