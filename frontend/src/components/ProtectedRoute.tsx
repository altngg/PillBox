import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../pages/styles/Admin.css"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false
}) => {
  const { loading, isAuth, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Проверка прав...</div>
  }

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (requireAdmin && !user?.is_superuser) {
    return (
      <div className="forbidden-container">
        <h2>Forbidden page</h2>
        <p>Только администраторы могут видеть эту страницу.</p>
        <button onClick={() => window.history.back()} className="back-button">
          Вернуться назад
        </button>
      </div>
    )
  }

  return <>{children}</>
}