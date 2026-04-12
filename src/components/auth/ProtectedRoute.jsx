import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Spinner } from '@heroui/react'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, initialized, fetchMe } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    // On first load, if we have tokens but haven't fetched user yet
    if (!initialized || (!isAuthenticated && !isLoading)) {
      fetchMe()
    }
  }, [initialized])

  // Still loading (fetching user data or refreshing token)
  if (isLoading || !initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" color="current" className="text-accent" />
      </div>
    )
  }

  // Not authenticated after initialization complete
  if (!isAuthenticated) {
    return <Navigate to="/cabinet/login" state={{ from: location }} replace />
  }

  return children
}
