// src/pages/Register.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/authService';
import { AxiosError } from 'axios';
import { Header } from "../components/Header";
import './styles/Register.css';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Регистрация
      await register({ username, email, password });

      // 2. Автоматический вход после регистрации
      await login({ email, password });

      // 3. Переход в личный кабинет
      navigate('/pillbox', { replace: true });
    } catch (err) {
      console.error('Register error:', err);

      if (err instanceof AxiosError) {
        if (err.response?.status === 400 && err.response.data.detail === "Email already registered") {
          setError('Пользователь с таким email уже существует');
        } else if (err.response?.status === 422) {
          setError('Проверьте правильность данных (email, пароль)');
        } else {
          setError('Ошибка при регистрации. Попробуйте позже.');
        }
      } else {
        setError('Ошибка сети или сервер недоступен');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="register-container">
        <h2 className="register-title">Регистрация</h2>

        {error && <div className="register-error">{error}</div>}

        <form className="register-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="username">Имя пользователя:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Продолжить'}
          </button>
        </form>
      </div>
    </div>
  );
}