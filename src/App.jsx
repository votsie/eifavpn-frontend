import { Routes, Route, Navigate } from 'react-router-dom'
import LandingLayout from './layouts/LandingLayout'
import CabinetLayout from './layouts/CabinetLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

import Overview from './pages/cabinet/Overview'
import Servers from './pages/cabinet/Servers'
import Devices from './pages/cabinet/Devices'
import Referral from './pages/cabinet/Referral'
import Settings from './pages/cabinet/Settings'
import Guide from './pages/cabinet/Guide'
import Purchase from './pages/cabinet/Purchase'

export default function App() {
  return (
    <Routes>
      {/* Landing */}
      <Route element={<LandingLayout />}>
        <Route index element={<Landing />} />
      </Route>

      {/* Auth */}
      <Route path="/cabinet/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Cabinet (protected) */}
      <Route
        path="/cabinet"
        element={
          <ProtectedRoute>
            <CabinetLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="servers" element={<Servers />} />
        <Route path="devices" element={<Devices />} />
        <Route path="referral" element={<Referral />} />
        <Route path="purchase" element={<Purchase />} />
        <Route path="settings" element={<Settings />} />
        <Route path="guide" element={<Guide />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
