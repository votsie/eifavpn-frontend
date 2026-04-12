import { Outlet } from 'react-router-dom'
import Sidebar from '../components/cabinet/Sidebar'
import Topbar from '../components/cabinet/Topbar'
import Background from '../components/Background'

// Detect if running inside Telegram Mini App
function isTelegramWebApp() {
  return !!(window.Telegram?.WebApp?.initData)
}

export default function CabinetLayout() {
  const isTg = isTelegramWebApp()

  return (
    <div className="relative flex min-h-screen">
      <Background />
      {/* Desktop sidebar — hide in Telegram */}
      {!isTg && <Sidebar />}
      {/* Main content */}
      <div className={`relative z-10 flex flex-1 flex-col ${!isTg ? 'md:ml-60' : ''}`}>
        {!isTg && <Topbar />}
        <main className={`flex-1 px-4 pt-4 ${isTg ? 'pb-4' : 'pb-24 md:px-8 md:pb-8 md:pt-6'}`}>
          <Outlet />
        </main>
      </div>
      {/* Mobile bottom nav — hide in Telegram */}
      {!isTg && <Sidebar mobile />}
    </div>
  )
}
