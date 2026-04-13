import { Button } from '@heroui/react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:px-6 md:pt-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-6 rounded-2xl border border-border bg-surface/60 px-5 py-2.5 backdrop-blur-2xl md:px-6 md:py-3">
        <a href="/" className="flex shrink-0 items-center gap-2.5">
          <img src="/logo.png" alt="EIFAVPN" className="h-8 w-8 object-contain" />
          <span className="font-heading text-[17px] font-bold tracking-tight text-foreground">
            EIFAVPN
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          <a href="#features" className="text-[13px] font-medium text-muted transition-colors hover:text-foreground">
            Возможности
          </a>
          <a href="#plans" className="text-[13px] font-medium text-muted transition-colors hover:text-foreground">
            Тарифы
          </a>
          <a href="mailto:support@eifavpn.ru" className="text-[13px] font-medium text-muted transition-colors hover:text-foreground">
            Поддержка
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-3">
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
    </header>
  )
}
