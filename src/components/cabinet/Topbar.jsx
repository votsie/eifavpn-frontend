import { Button } from '@heroui/react'
import { ArrowRightFromSquare } from '@gravity-ui/icons'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'

export default function Topbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/cabinet/login')
  }

  return (
    <header className="relative z-10 flex items-center justify-between border-b border-border bg-surface/30 px-4 py-3 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 md:hidden">
          <img src="/logo.png" alt="" className="h-7 w-7 object-contain" />
          <span className="font-heading text-base font-bold text-foreground">EIFAVPN</span>
        </div>
        {/* Desktop user info */}
        <div className="hidden md:block">
          <p className="text-sm font-medium text-foreground">
            {user?.username || 'Пользователь'}
          </p>
          <p className="text-xs text-muted">{user?.email || ''}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && <StatusBadge status={user.status} />}
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
