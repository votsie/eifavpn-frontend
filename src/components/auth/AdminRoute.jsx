import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Spinner } from '@heroui/react'

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading, initialized, fetchMe } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (!initialized || (!isAuthenticated && !isLoading)) {
      fetchMe()
    }
  }, [initialized, isAuthenticated, isLoading, fetchMe])

  if (isLoading || !initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" color="current" className="text-accent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/cabinet/login" state={{ from: location }} replace />
  }

  if (!user?.is_staff) {
    return <Navigate to="/cabinet/overview" replace />
  }

  return children
}
