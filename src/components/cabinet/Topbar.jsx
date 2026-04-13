import { Button } from '@heroui/react'
import { ArrowRightFromSquare, Gear } from '@gravity-ui/icons'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate, Link } from 'react-router-dom'

export default function Topbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/cabinet/login')
  }

  return (
    <header className="relative z-10 flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 md:hidden">
          <img src="/logo.png" alt="" className="h-7 w-7 object-contain" />
          <span className="font-heading text-base font-bold text-foreground">EIFAVPN</span>
        </div>
        {/* Desktop user info */}
        <div className="hidden md:block">
          <p className="text-sm font-medium text-foreground">
            {user?.first_name || user?.email?.split('@')[0] || 'Пользователь'}
          </p>
          <p className="text-xs text-muted">{user?.email || ''}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Settings gear — mobile only */}
        <Link
          to="/cabinet/settings"
          aria-label="Настройки"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-default hover:text-foreground md:hidden"
        >
          <Gear className="h-[18px] w-[18px]" />
        </Link>
        <Button
          size="sm"
          variant="tertiary"
          onPress={handleLogout}
          className="text-muted"
        >
          <ArrowRightFromSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Выйти</span>
        </Button>
      </div>
    </header>
  )
}
