import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import { Spinner } from '@heroui/react'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

// Layouts — loaded eagerly (small, needed for shell)
import LandingLayout from './layouts/LandingLayout'
import CabinetLayout from './layouts/CabinetLayout'
import AdminLayout from './layouts/AdminLayout'

// Landing & auth — loaded eagerly (entry points)
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Lazy: public pages
const Terms = lazy(() => import('./pages/Terms'))
const TelegramApp = lazy(() => import('./pages/TelegramApp'))
const Download = lazy(() => import('./pages/Download'))
const ConnectPage = lazy(() => import('./pages/Connect'))

// Lazy: cabinet pages
const Overview = lazy(() => import('./pages/cabinet/Overview'))
const Servers = lazy(() => import('./pages/cabinet/Servers'))
const Devices = lazy(() => import('./pages/cabinet/Devices'))
const Referral = lazy(() => import('./pages/cabinet/Referral'))
const Settings = lazy(() => import('./pages/cabinet/Settings'))
const Guide = lazy(() => import('./pages/cabinet/Guide'))
const Purchase = lazy(() => import('./pages/cabinet/Purchase'))
const History = lazy(() => import('./pages/cabinet/History'))

// Lazy: admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminUserDetail = lazy(() => import('./pages/admin/UserDetail'))
const AdminSubscriptions = lazy(() => import('./pages/admin/Subscriptions'))
const AdminPayments = lazy(() => import('./pages/admin/Payments'))
const AdminReferrals = lazy(() => import('./pages/admin/Referrals'))
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'))
const AdminNotifications = lazy(() => import('./pages/admin/Notifications'))
const AdminPromo = lazy(() => import('./pages/admin/Promo'))
const AdminAudit = lazy(() => import('./pages/admin/Audit'))
const AdminSystem = lazy(() => import('./pages/admin/System'))
const AdminExport = lazy(() => import('./pages/admin/Export'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))
const AdminPricing = lazy(() => import('./pages/admin/Pricing'))
const AdminSupport = lazy(() => import('./pages/admin/Support'))

function PageSpinner() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spinner size="lg" color="current" className="text-accent" />
    </div>
  )
}

function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <img src="/logo.png" alt="EIFAVPN" className="mb-6 h-16 w-16 object-contain" />
      <h1 className="font-heading text-2xl font-bold text-foreground">Ведутся технические работы</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        Сайт временно недоступен. Мы проводим обновление для улучшения сервиса. Пожалуйста, попробуйте позже.
      </p>
    </div>
  )
}

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
  const [maintenance, setMaintenance] = useState(false)
  const [mChecked, setMChecked] = useState(false)
  const location = useLocation()

  useEffect(() => {
    fetch('/api/maintenance/')
      .then(r => r.json())
      .then(d => { setMaintenance(d.maintenance); setMChecked(true) })
      .catch(() => setMChecked(true))
  }, [])

  // Show maintenance page for non-admin routes
  if (mChecked && maintenance && !location.pathname.startsWith('/admin')) {
    return <MaintenancePage />
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSpinner />}>
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
            <Route path="history" element={<History />} />
          </Route>

          {/* Admin (staff only) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
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
            <Route path="support" element={<AdminSupport />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
