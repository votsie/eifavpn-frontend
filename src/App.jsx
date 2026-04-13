import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import LandingLayout from './layouts/LandingLayout'
import CabinetLayout from './layouts/CabinetLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Terms from './pages/Terms'
import TelegramApp from './pages/TelegramApp'

import Download from './pages/Download'
import ConnectPage from './pages/Connect'
import Overview from './pages/cabinet/Overview'
import Servers from './pages/cabinet/Servers'
import Devices from './pages/cabinet/Devices'
import Referral from './pages/cabinet/Referral'
import Settings from './pages/cabinet/Settings'
import Guide from './pages/cabinet/Guide'
import Purchase from './pages/cabinet/Purchase'

import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminUserDetail from './pages/admin/UserDetail'
import AdminSubscriptions from './pages/admin/Subscriptions'
import AdminPayments from './pages/admin/Payments'
import AdminReferrals from './pages/admin/Referrals'
import AdminAnalytics from './pages/admin/Analytics'
import AdminNotifications from './pages/admin/Notifications'
import AdminPromo from './pages/admin/Promo'
import AdminAudit from './pages/admin/Audit'
import AdminSystem from './pages/admin/System'
import AdminExport from './pages/admin/Export'
import AdminSettings from './pages/admin/Settings'
import AdminPricing from './pages/admin/Pricing'

function useAnalyticsPageview() {
  const location = useLocation()
  useEffect(() => {
    if (window.ym) {
      window.ym(108520192, 'hit', location.pathname + location.search)
    }
  }, [location])
}

export default function App() {
  useAnalyticsPageview()
  return (
    <Routes>
      {/* Landing */}
      <Route element={<LandingLayout />}>
        <Route index element={<Landing />} />
      </Route>

      {/* Auth + Legal */}
      <Route path="/cabinet/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/app" element={<TelegramApp />} />
      <Route path="/download/:platform" element={<Download />} />
      <Route path="/connect" element={<ConnectPage />} />

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

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<AdminUserDetail />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="referrals" element={<AdminReferrals />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="promo" element={<AdminPromo />} />
        <Route path="audit" element={<AdminAudit />} />
        <Route path="system" element={<AdminSystem />} />
        <Route path="export" element={<AdminExport />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="pricing" element={<AdminPricing />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
