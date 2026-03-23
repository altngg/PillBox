import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { Header } from "../components/Header"
import { useAuth } from "../context/AuthContext"

import "./styles/Login.css"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login(email, password)
      navigate("/pillbox", { replace: true })
    } catch (err) {
      console.error("Login error:", err)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          setError("Неверный email или пароль")
        } else if (err.response?.status === 422) {
          setError("Проверьте правильность email и пароля")
        } else {
          setError("Ошибка подключения к серверу")
        }
      } else {
        setError("Ошибка сети или сервер недоступен")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <div className="login-container">
        <h2 className="login-title">Вход</h2>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Почта:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Вход..." : "Продолжить"}
          </button>
        </form>
      </div>
    </div>
  )
}