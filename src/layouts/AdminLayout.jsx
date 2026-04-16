import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutList,
  Persons,
  ShoppingCart,
  ChartLine,
  CreditCard,
  NodesRight,
  ArrowLeft,
  Clock,
  Cpu,
  ArrowDownToSquare,
  Gear,
  Bell,
  Tag,
  CommentFill,
} from '@gravity-ui/icons'
import Background from '../components/Background'

const adminLinks = [
  { to: '/admin', icon: LayoutList, label: 'Панель', end: true },
  { to: '/admin/users', icon: Persons, label: 'Пользователи' },
  { to: '/admin/subscriptions', icon: ShoppingCart, label: 'Подписки' },
  { to: '/admin/payments', icon: CreditCard, label: 'Платежи' },
  { to: '/admin/referrals', icon: NodesRight, label: 'Рефералы' },
  { to: '/admin/analytics', icon: ChartLine, label: 'Аналитика' },
  { to: '/admin/notifications', icon: Bell, label: 'Рассылки' },
  { to: '/admin/promo', icon: Tag, label: 'Промокоды' },
  { to: '/admin/support', icon: CommentFill, label: 'Поддержка' },
  { to: '/admin/audit', icon: Clock, label: 'Журнал' },
  { to: '/admin/system', icon: Cpu, label: 'Система' },
  { to: '/admin/export', icon: ArrowDownToSquare, label: 'Экспорт' },
  { to: '/admin/pricing', icon: CreditCard, label: 'Цены' },
  { to: '/admin/settings', icon: Gear, label: 'Настройки' },
]

function SidebarLink({ to, icon: Icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
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

export default function AdminLayout() {
  return (
    <div className="relative flex min-h-screen">
      <Background />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-60 flex-col border-r border-border bg-surface md:flex">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <img src="/logo.png" alt="EIFAVPN" className="h-8 w-8 object-contain" />
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            EIFAVPN <span className="text-xs font-normal text-muted">Админ</span>
          </span>
        </div>

        {/* Nav links */}
        <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-1 px-3 pt-2">
          {adminLinks.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </nav>

        {/* Back to cabinet */}
        <div className="border-t border-border px-3 py-4">
          <NavLink
            to="/cabinet/overview"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            ← В кабинет
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col md:ml-60">
        {/* Mobile header */}
        <header className="flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 md:hidden">
          <img src="/logo.png" alt="EIFAVPN" className="h-7 w-7 object-contain" />
          <span className="font-heading text-base font-bold text-foreground">Admin</span>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-surface/50 px-3 py-2 md:hidden">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive ? 'bg-accent/12 text-accent' : 'text-muted'
                }`
              }
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 overflow-x-hidden px-3 pb-8 pt-4 md:px-8 md:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
