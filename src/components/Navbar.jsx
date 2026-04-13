import { useState } from 'react'
import { Button } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon } from '@gravity-ui/icons'

function ThemeToggle() {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark')

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('eifavpn_theme', next)
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.style.colorScheme = next
  }

  return (
    <button onClick={toggle} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-default hover:text-foreground" aria-label="Сменить тему">
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:px-6 md:pt-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-6 rounded-2xl border-b border-border bg-background px-5 py-2.5 md:px-6 md:py-3">
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
          <ThemeToggle />
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
