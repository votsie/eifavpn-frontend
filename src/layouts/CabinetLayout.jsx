import { Outlet } from 'react-router-dom'
import Sidebar from '../components/cabinet/Sidebar'
import Topbar from '../components/cabinet/Topbar'
import Background from '../components/Background'

export default function CabinetLayout() {
  return (
    <div className="relative flex min-h-screen">
      <Background />
      {/* Desktop sidebar */}
      <Sidebar />
      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col md:ml-60">
        <Topbar />
        <main className="flex-1 px-4 pb-24 pt-4 md:px-8 md:pb-8 md:pt-6">
          <Outlet />
        </main>
      </div>
      {/* Mobile bottom nav */}
      <Sidebar mobile />
    </div>
  )
}
