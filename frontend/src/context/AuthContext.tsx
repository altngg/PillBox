import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest
} from "../services/authService"
import type { UserProfile } from "../services/authService"

type AuthContextType = {
  isAuth: boolean
  loading: boolean
  user: UserProfile | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setIsAuth(true)
    } catch {
      setUser(null)
      setIsAuth(false)
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    await loginRequest({ email, password })
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setIsAuth(true)
  }

  async function logout() {
    await logoutRequest()
    setUser(null)
    setIsAuth(false)
  }

  return (
    <AuthContext.Provider value={{ isAuth, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}