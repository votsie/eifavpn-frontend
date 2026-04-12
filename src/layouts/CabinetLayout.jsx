import { Outlet } from 'react-router-dom'
import Sidebar from '../components/cabinet/Sidebar'
import Topbar from '../components/cabinet/Topbar'
import Background from '../components/Background'

function isTelegramWebApp() {
  return !!(window.Telegram?.WebApp?.initData)
}

export default function CabinetLayout() {
  const isTg = isTelegramWebApp()

  return (
    <div className="relative flex min-h-screen">
      <Background />
      {/* Desktop sidebar — hide in Telegram (Telegram is always mobile) */}
      {!isTg && <Sidebar />}
      {/* Main content */}
      <div className={`relative z-10 flex flex-1 flex-col ${!isTg ? 'md:ml-60' : ''}`}>
        {!isTg && <Topbar />}
        <main className={`flex-1 overflow-x-hidden px-3 pb-24 pt-4 ${!isTg ? 'md:px-8 md:pb-8 md:pt-6' : ''}`}>
          <Outlet />
        </main>
      </div>
      {/* Bottom nav — always show (mobile + Telegram) */}
      <Sidebar mobile />
    </div>
  )
}
