import { NavLink } from 'react-router-dom'
import {
  LayoutList,
  Smartphone,
  Persons,
  Gear,
  ShoppingCart,
  Clock,
} from '@gravity-ui/icons'

const links = [
  { to: '/cabinet/overview', icon: LayoutList, label: 'Обзор' },
  { to: '/cabinet/purchase', icon: ShoppingCart, label: 'Тарифы' },
  { to: '/cabinet/devices', icon: Smartphone, label: 'Устройства' },
  { to: '/cabinet/referral', icon: Persons, label: 'Рефералы' },
  { to: '/cabinet/history', icon: Clock, label: 'Платежи' },
  { to: '/cabinet/settings', icon: Gear, label: 'Настройки' },
]

// Mobile bottom nav: 4 main + guide (settings accessible via topbar gear)
const mobileLinks = [
  { to: '/cabinet/overview', icon: LayoutList, label: 'Обзор' },
  { to: '/cabinet/purchase', icon: ShoppingCart, label: 'Тарифы' },
  { to: '/cabinet/devices', icon: Smartphone, label: 'Устройства' },
  { to: '/cabinet/referral', icon: Persons, label: 'Рефералы' },
]

function SidebarLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-accent/12 text-accent shadow-[inset_3px_0_0_0_var(--accent)]'
            : 'text-muted hover:bg-default hover:text-foreground'
        }`
      }
    >
      <Icon className="h-[18px] w-[18px]" />
      {label}
    </NavLink>
  )
}

export default function Sidebar({ mobile = false }) {
  if (mobile) {
    return (
      <nav aria-label="Основная навигация" className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-surface md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {mobileLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 pb-1.5 pt-2.5 text-[10px] font-medium transition-all duration-200 ${
                isActive ? 'text-accent' : 'text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-accent/12' : ''
                }`}>
                  <link.icon className="h-[18px] w-[18px]" />
                </div>
                <span className="mt-0.5">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    )
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-60 flex-col border-r border-border bg-surface md:flex">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <img src="/logo.png" alt="EIFAVPN" className="h-8 w-8 object-contain" />
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">
          EIFAVPN
        </span>
      </div>

      {/* Nav links */}
      <nav aria-label="Боковая навигация" className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {links.map((link) => (
          <SidebarLink key={link.to} {...link} />
        ))}
      </nav>

      {/* Back to landing */}
      <div className="border-t border-border px-3 py-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          ← На главную
        </NavLink>
      </div>
    </aside>
  )
}
