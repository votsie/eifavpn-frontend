import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Spinner } from '@heroui/react'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, fetchMe } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      fetchMe()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" color="current" className="text-accent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/cabinet/login" state={{ from: location }} replace />
  }

  return children
}
